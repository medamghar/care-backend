import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateShopInput, UpdateShopPasswordInput, CreateShopInput } from './dto/shop.dto';
import { CreateShopImageInput, UpdateShopImageInput } from './dto/shop-image.dto';
import { ShopFiltersInput } from './dto/shop-filters.dto';
import { ShopStats } from './dto/shop-stats.dto';
import * as bcrypt from 'bcrypt';
import { ImageService } from 'src/images/images.service';
import { FileUpload } from 'graphql-upload-ts';
@Injectable()
export class ShopsService {
  constructor(private prisma: PrismaService, private readonly imageService: ImageService) { }
  private readonly baseUrl = process.env.BASE_URL || 'http://192.168.1.47:3000';

  async findById(id: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { id },
      include: {
        shopImages: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    return shop;
  }

  async findByPhone(phone: string) {
    return this.prisma.shop.findUnique({
      where: { phone },
    });
  }

  async findAll(filters?: ShopFiltersInput) {
  const where: any = {};
  if (filters) {
    if (filters.search) {
      where.OR = [
        { nameAr: { contains: filters.search, mode: 'insensitive' } },
        { nameFr: { contains: filters.search, mode: 'insensitive' } },
        { ownerName: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.city) {
      where.city = { contains: filters.city, mode: 'insensitive' };
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.ownerName) {
      where.ownerName = { contains: filters.ownerName, mode: 'insensitive' };
    }
  }

  const shops = await this.prisma.shop.findMany({
    where,
    include: {
      shopImages: {
        orderBy: { sortOrder: 'asc' },
      },
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: {
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Transform the data to include lastOrder field
  return shops.map(shop => ({
    ...shop,
    lastOrder: shop.orders.length > 0 ? shop.orders[0].createdAt.toISOString() : null,
    orders: undefined, // Remove orders from the response since we only needed it for lastOrder
  }));
}

async findPendingShops() {
  const shops = await this.prisma.shop.findMany({
    where: {
      status: 'PENDING',
    },
    include: {
      shopImages: {
        orderBy: { sortOrder: 'asc' },
      },
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: {
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Transform the data to include lastOrder field
  return shops.map(shop => ({
    ...shop,
    lastOrder: shop.orders.length > 0 ? shop.orders[0].createdAt.toISOString() : null,
    orders: undefined, // Remove orders from the response since we only needed it for lastOrder
  }));
}
  async getShopStats(): Promise<ShopStats> {
    const totalShops = await this.prisma.shop.count();
    const activeShops = await this.prisma.shop.count({
      where: { status: 'APPROVED' },
    });
    const pendingApprovals = await this.prisma.shop.count({
      where: { status: 'PENDING' },
    });
    const blockedShops = await this.prisma.shop.count({
      where: { status: 'BLOCKED' },
    });

    // Get shops created this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newShopsThisMonth = await this.prisma.shop.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    return {
      totalShops,
      activeShops,
      pendingApprovals,
      blockedShops,
      newShopsThisMonth,
    };
  }


  async updatePassword(id: string, input: UpdateShopPasswordInput) {
    // Check if shop exists
    const shop = await this.findById(id);

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(
      input.oldPassword,
      shop.passwordHash,
    );
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(input.newPassword, 10);

    // Update password
    const updatedShop = await this.prisma.shop.update({
      where: { id },
      data: {
        passwordHash: hashedNewPassword,
        updatedAt: new Date(),
      },
    });

    return updatedShop;
  }

  async updateStatus(
    id: string,
    status: 'PENDING' | 'APPROVED' | 'BLOCKED',
    approvedByUserId?: string,
  ) {
    // Check if shop exists
    await this.findById(id);

    const updatedShop = await this.prisma.shop.update({
      where: { id },
      data: {
        status,
        approvedByUserId: status === 'APPROVED' ? approvedByUserId : null,
        updatedAt: new Date(),
      },
    });

    return updatedShop;
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Check if shop exists
      await this.findById(id);

      await this.prisma.shop.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async findShopImages(shopId: string) {
    return this.prisma.shopImage.findMany({
      where: { shopId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async addShopImage(input: CreateShopImageInput) {
    const { shopId, imageUrl, sortOrder = 0 } = input;

    // Check if shop exists
    await this.findById(shopId);

    return this.prisma.shopImage.create({
      data: {
        shopId,
        imageUrl,
        sortOrder,
      },
    });
  }

  async updateShopImage(id: string, input: UpdateShopImageInput) {
    const existingImage = await this.prisma.shopImage.findUnique({
      where: { id },
    });

    if (!existingImage) {
      throw new NotFoundException('Shop image not found');
    }

    return this.prisma.shopImage.update({
      where: { id },
      data: input,
    });
  }

  async deleteShopImage(id: string): Promise<boolean> {
    try {
      const existingImage = await this.prisma.shopImage.findUnique({
        where: { id },
      });

      if (!existingImage) {
        throw new NotFoundException('Shop image not found');
      }

      await this.prisma.shopImage.delete({
        where: { id },
      });

      return true;
    } catch {
      return false;
    }
  }

  async createShop(input: CreateShopInput, createdByUserId?: string) {
    const { password, ...shopData } = input;

    // Check if phone already exists
    const existingShop = await this.prisma.shop.findUnique({
      where: { phone: input.phone },
    });

    if (existingShop) {
      throw new ConflictException('Phone number already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create shop
    const shop = await this.prisma.shop.create({
      data: {
        ...shopData,
        passwordHash: hashedPassword,
        status: 'APPROVED', // Admin-created shops are automatically approved
        createdByUserId,
        approvedByUserId: createdByUserId,
      },
      include: {
        shopImages: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return shop;
  }


  async update(id: string, input: UpdateShopInput, image?: Promise<FileUpload[]>) {
    // Check if shop exists
    await this.findById(id);
    console.log('New images promise received:', image);

    // Update shop data
    const updatedShop = await this.prisma.shop.update({
      where: { id },
      data: {
        ...input,
        updatedAt: new Date(),
      },
    });

    // Handle image updates if provided
    if (image) {
      try {
        // Resolve the promise to get FileUpload[]
        const resolvedImages = await image;
        console.log('Resolved images:', resolvedImages);

        // Validate resolved images
        if (!Array.isArray(resolvedImages)) {
          throw new BadRequestException('Invalid image data: expected array of files');
        }

        if (resolvedImages.length > 0) {
          // Validate each file upload object
          for (let i = 0; i < resolvedImages.length; i++) {
            const upload = resolvedImages[i];
            if (!upload || typeof upload !== 'object') {
              throw new BadRequestException(`Invalid file upload at index ${i}: expected FileUpload object`);
            }

            // Check for required FileUpload properties (adjust based on your FileUpload interface)
            
           
          }

          // Convert FileUpload[] to Promise<FileUpload>[]
          const filePromises = resolvedImages.map(upload => Promise.resolve(upload));

          // Upload the images
          const uploadedImages = await this.imageService.uploadMultipleImages(filePromises);

          if (uploadedImages && uploadedImages.length > 0) {
            // Delete existing images
            await this.prisma.shopImage.deleteMany({
              where: { shopId: id },
            });

            // Create new images
            const newImages = await this.prisma.shopImage.createMany({
              data: uploadedImages.map((img, index) => ({
                shopId: id,
                imageUrl: img.url.startsWith('http') ? img.url : `${this.baseUrl}${img.url}`,
                sortOrder: index,
              })),
            });
            console.log('New images created:', uploadedImages);

            if (!newImages) {
              throw new NotFoundException('Shop images not updated');
            }
          }
        }
      } catch (error) {
        // Handle different types of errors
        if (error instanceof BadRequestException || error instanceof NotFoundException) {
          // Re-throw our custom exceptions
          throw error;
        }

        // Handle promise rejection errors
        if (error.name === 'TypeError' && error.message.includes('Promise')) {
          throw new BadRequestException('Failed to resolve image promise: invalid promise provided');
        }

        // Handle parsing/validation errors
        if (error.name === 'SyntaxError' || error.message.includes('parse')) {
          throw new BadRequestException(`Image data parsing failed: ${error.message}`);
        }

        // Handle network/upload errors
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
          throw new BadRequestException('Image upload service unavailable');
        }

        // Log the original error for debugging
        console.error('Unexpected error in image processing:', error);

        // Generic error fallback
        throw new BadRequestException(`Image processing failed: ${error.message || 'Unknown error'}`);
      }
    }

    return updatedShop;
  }
}
