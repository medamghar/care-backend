import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderInput, UpdateOrderStatusInput, OrderFilters, OrderStats, OrderStatus, OrderAnalytics } from './dto/order.dto';
import { PubserviceService } from 'src/pubservice/pubservice.service';
import { CartCalculationResult, CartItemInput } from './orders.resolver';
export declare class OrdersService {
    private prisma;
    private readonly pubSubService;
    constructor(prisma: PrismaService, pubSubService: PubserviceService);
    calculateCartTotal(items: CartItemInput[]): Promise<CartCalculationResult>;
    private calculateItemTotal;
    private calculatePriceTierPrice;
    private getBestPromotion;
    private calculatePromotionDiscount;
    createOrder(shopId: string, input: CreateOrderInput): Promise<any>;
    getOrder(id: string, userId?: string, userType?: string): Promise<any>;
    private transformOrderForGraphQL;
    getOrders(filters: OrderFilters, userId?: string, userType?: string): Promise<any>;
    updateOrderStatus(id: string, input: UpdateOrderStatusInput): Promise<any>;
    cancelOrder(id: string, userId?: string, userType?: string): Promise<any>;
    getOrderStats(): Promise<OrderStats>;
    getShopOrders(shopId: string, status?: OrderStatus): Promise<any[]>;
    reorderFromPreviousOrder(originalOrderId: string, shopId: string): Promise<any>;
    getOrderAnalytics(period?: string): Promise<OrderAnalytics>;
}
