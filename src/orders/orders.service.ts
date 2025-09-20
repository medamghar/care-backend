import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateOrderInput,
  UpdateOrderStatusInput,
  OrderFilters,
  OrderStats,
  OrderStatus,
  OrderAnalytics,
} from './dto/order.dto';
import { PubserviceService } from 'src/pubservice/pubservice.service';
import { CartCalculationResult, CartItem, CartItemInput } from './orders.resolver';

// Add proper DTOs


@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private readonly pubSubService: PubserviceService,
  ) { }

  async calculateCartTotal(items: CartItemInput[]): Promise<CartCalculationResult> {
    const itemResults: CartItem[] = [];
    let total = 0;

    for (const item of items) {
      const itemTotal = await this.calculateItemTotal(item);
      itemResults.push({
        productId: item.productId,
        total: Math.round(itemTotal * 100) / 100, // Round to 2 decimal places
      });
      total += itemTotal;
    }

    return {
      items: itemResults,
      total: Math.round(total * 100) / 100, // Round to 2 decimal places
    };
  }

  private async calculateItemTotal(item: CartItemInput): Promise<number> {
    // Get product details with price tiers and active promotions
    const product = await this.prisma.product.findUnique({
      where: { id: item.productId },
      include: {
        priceTiers: {
          orderBy: { minQuantity: 'desc' },
        },
        promotionProducts: {
          include: {
            promotion: true,
          },
        },
        category: {
          include: {
            promotionCategories: {
              include: {
                promotion: true,
              },
            },
          },
        },
      },
    });

    // Filter active promotions in JavaScript
    if (product) {
      const currentDate = new Date();

      // Filter product promotions
      product.promotionProducts = product.promotionProducts.filter(pp =>
        pp.promotion.isActive &&
        pp.promotion.startDate <= currentDate &&
        pp.promotion.endDate >= currentDate
      );

      // Filter category promotions
      if (product.category) {
        product.category.promotionCategories = product.category.promotionCategories.filter(pc =>
          pc.promotion.isActive &&
          pc.promotion.startDate <= currentDate &&
          pc.promotion.endDate >= currentDate
        );
      }
    }

    if (!product) {
      throw new Error(`Product with id ${item.productId} not found`);
    }

    // Calculate base price using price tiers
    const unitPrice = this.calculatePriceTierPrice(
      product.basePrice,
      product.priceTiers,
      item.quantity,
    );

    let finalUnitPrice = unitPrice;

    // Check for product-specific promotions
    const productPromotion = this.getBestPromotion([
      ...product.promotionProducts.map(pp => pp.promotion),
      ...product.category.promotionCategories.map(pc => pc.promotion),
    ]);

    if (productPromotion) {
      const discount = this.calculatePromotionDiscount(
        unitPrice,
        productPromotion,
      );

      if (discount.finalPrice < finalUnitPrice) {
        finalUnitPrice = discount.finalPrice;
      }
    }

    return finalUnitPrice * item.quantity;
  }

  private calculatePriceTierPrice(
    basePrice: number,
    priceTiers: any[],
    quantity: number,
  ): number {
    // Find the best applicable price tier
    const applicableTier = priceTiers.find(tier => quantity >= tier.minQuantity);

    if (applicableTier) {
      return applicableTier.pricePerUnit;
    }

    return basePrice;
  }

  private getBestPromotion(promotions: any[]) {
    if (!promotions.length) return null;

    // Sort promotions by value (highest first for percentage, then fixed)
    return promotions.sort((a, b) => {
      if (a.type === 'PERCENTAGE' && b.type === 'PERCENTAGE') {
        return b.value - a.value;
      }
      if (a.type === 'FIXED' && b.type === 'FIXED') {
        return b.value - a.value;
      }
      // Prefer percentage over fixed for comparison
      if (a.type === 'PERCENTAGE') return -1;
      if (b.type === 'PERCENTAGE') return 1;
      return 0;
    })[0];
  }

  private calculatePromotionDiscount(
    unitPrice: number,
    promotion: any,
  ): { finalPrice: number } {
    let discountAmount = 0;

    if (promotion.type === 'PERCENTAGE') {
      discountAmount = (unitPrice * promotion.value) / 100;
    } else if (promotion.type === 'FIXED') {
      discountAmount = Math.min(promotion.value, unitPrice);
    }

    const finalPrice = Math.max(0, unitPrice - discountAmount);

    return { finalPrice };
  }

  async createOrder(shopId: string, input: CreateOrderInput) {
    try {
      console.log('=== ORDERS SERVICE CREATE ORDER ===');
      console.log('Shop ID:', shopId);
      console.log('Input:', JSON.stringify(input, null, 2));

      // Verify shop exists and is approved
      console.log('Looking up shop with ID:', shopId);
      const shop = await this.prisma.shop.findUnique({
        where: { id: shopId },
      });

      console.log('Shop found:', shop ? 'Yes' : 'No');
      if (shop) {
        console.log('Shop status:', shop.status);
        console.log('Shop name:', shop.nameAr);
      }

      if (!shop) {
        console.log('ERROR: Shop not found');
        throw new NotFoundException('Shop not found');
      }

      if (shop.status !== 'APPROVED') {
        console.log('ERROR: Shop not approved, status:', shop.status);
        throw new ForbiddenException('Shop is not approved to place orders');
      }

      // Use the cart calculation service for consistent pricing
      const cartCalculation = await this.calculateCartTotal(input.items);
      console.log('Cart calculation result:', cartCalculation);

      // Validate products and check stock availability
      console.log('Validating products...');
      const productIds = input.items.map((item) => item.productId);
      console.log('Product IDs:', productIds);

      const products = await this.prisma.product.findMany({
        where: {
          id: { in: productIds },
          isActive: true,
        },
      });

      console.log('Products found:', products.length);
      if (products.length !== productIds.length) {
        console.log('ERROR: Some products not found or inactive');
        throw new BadRequestException('Some products not found or inactive');
      }

      // Check stock availability
      console.log('Checking stock availability...');
      for (const item of input.items) {
        const product = products.find((p) => p.id === item.productId);
        console.log(
          `Product ${product.nameAr}: requested ${item.quantity}, available ${product.currentStock}`,
        );
        if (product.currentStock < item.quantity) {
          console.log(
            `ERROR: Insufficient stock for product ${product.nameAr}`,
          );
          throw new BadRequestException(
            `Insufficient stock for product ${product.nameAr}`,
          );
        }
      }

      // Prepare order items using cart calculation results
      const orderItems = [];
      for (const cartItem of cartCalculation.items) {
        const inputItem = input.items.find(i => i.productId === cartItem.productId);
        const unitPrice = cartItem.total / inputItem.quantity;

        orderItems.push({
          productId: cartItem.productId,
          quantity: inputItem.quantity,
          unitPrice: Math.round(unitPrice * 100) / 100,
          totalPrice: cartItem.total,
        });
      }

      const subtotal = cartCalculation.total;
      console.log('Subtotal:', subtotal);

      // Generate order number
      const orderCount = await this.prisma.order.count();
      const orderNumber = `ORD-${Date.now()}-${(orderCount + 1).toString().padStart(4, '0')}`;
      console.log('Order number:', orderNumber);

      // Calculate tax (assuming 20% VAT for Morocco)
      const taxAmount = 0;
      const totalAmount = Math.round((subtotal + taxAmount) * 100) / 100;
      console.log('Tax amount:', taxAmount, 'Total amount:', totalAmount);

      // Create order in transaction
      console.log('Creating order in database...');
      const order = await this.prisma.$transaction(async (tx) => {
        // Create the order
        const newOrder = await tx.order.create({
          data: {
            shopId,
            orderNumber,
            status: 'NEW',
            subtotal,
            discountAmount: 0,
            taxAmount,
            totalAmount,
            notes: input.notes,
            items: {
              create: orderItems,
            },
          },
          include: {
            shop: true,
            items: {
              include: {
                product: {
                  include: {
                    images: {
                      where: { isPrimary: true },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        });

        // Update product stock
        for (const item of input.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              currentStock: {
                decrement: item.quantity,
              },
            },
          });
        }

        return newOrder;
      });

      console.log('Order created successfully with ID:', order.id);

      // Send order confirmation notification
      

      return this.transformOrderForGraphQL(order);
    } catch (error) {
      console.log('=== ORDERS SERVICE ERROR ===');
      console.log('Error:', error);
      console.log('Error message:', error.message);
      throw error;
    }
  }

  async getOrder(id: string, userId?: string, userType?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        shop: true,
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check permissions - shops can only see their own orders
    if (userType === 'shop' && order.shopId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Transform the order to match GraphQL schema
    return this.transformOrderForGraphQL(order);
  }

  private transformOrderForGraphQL(order: any) {
    return {
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          images: item.product.images?.map((img) => ({
            id: img.id,
            imageUrl: img.imageUrl,
            sortOrder: img.sortOrder || 0,
            isPrimary: img.isPrimary || false,
          })) || [],
        },
      })),
    };
  }

  async getOrders(
    filters: OrderFilters,
    userId?: string,
    userType?: string,
  ): Promise<any> {
    const { status, shopId, dateFrom, dateTo, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Apply user-specific filters
    if (userType === 'shop') {
      where.shopId = userId;
    } else if (shopId) {
      where.shopId = shopId;
    }

    if (status) {
      where.status = status;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          shop: true,
          items: {
            include: {
              product: {
                include: {
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders: orders.map((order) => this.transformOrderForGraphQL(order)),
      total,
      page,
      limit,
      hasMore: skip + orders.length < total,
    };
  }

  async updateOrderStatus(id: string, input: UpdateOrderStatusInput) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updateData: any = {
      status: input.status,
    };

    // Set timestamps based on status
    if (input.status === 'PROCESSING' && !order.processedAt) {
      updateData.processedAt = new Date();
    } else if (input.status === 'DELIVERED' && !order.deliveredAt) {
      updateData.deliveredAt = new Date();
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        shop: true,
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    try {
//       await this.pubSubService.publish(`userNotification_${order.shopId}`, {
//         userNotification: {
//           userId: order.shopId,
//         title: 'تحديث حالة الطلب',
// message: `تم تحديث حالة طلبك إلى ${input.status}`,

//           route: `/orders/${updatedOrder.id}`,
//           imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQasKPDCewT1v2j4mJjfCN1rqH2SczejiwkoA&s',
//           createdAt:order.createdAt,
//           isRead:false,
//           id:'frrfqre'
//         }
//       });
await this.pubSubService.publish('broadcastNotification', {
        broadcastNotification: {
          userId: order.shopId,
        title: 'تحديث حالة الطلب',
message: `تم تحديث حالة طلبك إلى ${input.status}`,

          route: `/orders/${updatedOrder.id}`,
          imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQasKPDCewT1v2j4mJjfCN1rqH2SczejiwkoA&s',
          createdAt:order.createdAt,
          isRead:false,
          id:'frrfqre'
        }
      });

      console.log(`Order status notification sent: ${input.status}`);
    } catch (notificationError) {
      console.error('Failed to send order status notification:', notificationError);
      // Don't fail the order update if notification fails
    }

    return this.transformOrderForGraphQL(updatedOrder);
  }

  async cancelOrder(id: string, userId?: string, userType?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check permissions
    if (userType === 'shop' && order.shopId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Can only cancel NEW or CONFIRMED orders
    if (!['NEW', 'CONFIRMED'].includes(order.status)) {
      throw new BadRequestException('Order cannot be cancelled at this stage');
    }

    // Cancel order and restore stock
    return this.prisma.$transaction(async (tx) => {
      // Update order status
      const cancelledOrder = await tx.order.update({
        where: { id },
        data: { status: 'CANCELLED' },
        include: {
          shop: true,
          items: {
            include: {
              product: {
                include: {
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      });

      // Restore product stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            currentStock: {
              increment: item.quantity,
            },
          },
        });
      }

      return this.transformOrderForGraphQL(cancelledOrder);
    });
  }

  async getOrderStats(): Promise<OrderStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      totalRevenue,
      todayRevenue,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'NEW' } }),
      this.prisma.order.count({ where: { status: 'PROCESSING' } }),
      this.prisma.order.count({ where: { status: 'DELIVERED' } }),
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: 'CANCELLED' } },
      }),
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: { not: 'CANCELLED' },
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      todayRevenue: todayRevenue._sum.totalAmount || 0,
    };
  }

  async getShopOrders(shopId: string, status?: OrderStatus) {
    const where: any = { shopId };
    if (status) {
      where.status = status;
    }

    const orders = await this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.transformOrderForGraphQL(order));
  }

  async reorderFromPreviousOrder(originalOrderId: string, shopId: string) {
    const originalOrder = await this.prisma.order.findUnique({
      where: { id: originalOrderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!originalOrder) {
      throw new NotFoundException('Original order not found');
    }

    if (originalOrder.shopId !== shopId) {
      throw new ForbiddenException('Access denied');
    }

    // Create new order with same items
    const orderItems = originalOrder.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    return this.createOrder(shopId, {
      items: orderItems,
      notes: `Reorder from ${originalOrder.orderNumber}`,
    });
  }

  async getOrderAnalytics(period: string = 'month'): Promise<OrderAnalytics> {
    const now = new Date();
    let startDate: Date;

    // Calculate date range based on period
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Get basic stats
    const [totalOrders, totalRevenueResult] = await Promise.all([
      this.prisma.order.count({
        where: {
          createdAt: { gte: startDate },
          status: { not: 'CANCELLED' },
        },
      }),
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          createdAt: { gte: startDate },
          status: { not: 'CANCELLED' },
        },
      }),
    ]);

    const totalRevenue = totalRevenueResult._sum.totalAmount || 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get orders by status
    const ordersByStatus = await this.prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
      where: {
        createdAt: { gte: startDate },
      },
    });

    const ordersByStatusFormatted = ordersByStatus.map((item) => ({
      status: item.status,
      count: item._count.status,
      percentage: totalOrders > 0 ? (item._count.status / totalOrders) * 100 : 0,
    }));

    // Get revenue by day (last 30 days)
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const revenueByDay = await this.prisma.order.groupBy({
      by: ['createdAt'],
      _sum: { totalAmount: true },
      _count: { id: true },
      where: {
        createdAt: { gte: last30Days },
        status: { not: 'CANCELLED' },
      },
    });

    const revenueByDayFormatted = revenueByDay.map((item) => ({
      date: item.createdAt.toISOString().split('T')[0],
      revenue: item._sum.totalAmount || 0,
      orders: item._count.id,
    }));

    // Get top products
    const topProductsData = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, totalPrice: true },
      where: {
        order: {
          createdAt: { gte: startDate },
          status: { not: 'CANCELLED' },
        },
      },
      orderBy: { _sum: { totalPrice: 'desc' } },
      take: 10,
    });

    const productIds = topProductsData.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        images: true,
      },
    });

    const topProducts = topProductsData.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        product: {
          id: product.id,
          nameAr: product.nameAr,
          nameFr: product.nameFr || '',
          sku: product.sku,
          basePrice: product.basePrice,
          currentStock: product.currentStock,
          images: product.images?.map((img) => ({
            id: img.id,
            imageUrl: img.imageUrl,
            sortOrder: img.sortOrder || 0,
            isPrimary: img.isPrimary || false,
          })) || [],
        },
        totalSold: item._sum.quantity || 0,
        revenue: item._sum.totalPrice || 0,
      };
    });

    // Get top shops
    const topShopsData = await this.prisma.order.groupBy({
      by: ['shopId'],
      _count: { id: true },
      _sum: { totalAmount: true },
      where: {
        createdAt: { gte: startDate },
        status: { not: 'CANCELLED' },
      },
      orderBy: { _sum: { totalAmount: 'desc' } },
      take: 10,
    });

    const shopIds = topShopsData.map((item) => item.shopId);
    const shops = await this.prisma.shop.findMany({
      where: { id: { in: shopIds } },
    });

    const topShops = topShopsData.map((item) => {
      const shop = shops.find((s) => s.id === item.shopId);
      return {
        shop: {
          id: shop.id,
          nameAr: shop.nameAr,
          nameFr: shop.nameFr,
          ownerName: shop.ownerName,
          phone: shop.phone,
          city: shop.city,
          address: shop.address,
          profileImage: shop.profileImage,
        },
        totalOrders: item._count.id,
        totalRevenue: item._sum.totalAmount || 0,
      };
    });

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      ordersByStatus: ordersByStatusFormatted,
      revenueByDay: revenueByDayFormatted,
      topProducts,
      topShops,
    };
  }
}