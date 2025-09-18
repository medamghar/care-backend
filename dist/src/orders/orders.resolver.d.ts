import { OrdersService } from './orders.service';
import { OrderConnection, OrderStats, CreateOrderInput, UpdateOrderStatusInput, OrderFilters, OrderStatus, OrderAnalytics, OrderProduct, OrderProductImage } from './dto/order.dto';
import { PubserviceService } from 'src/pubservice/pubservice.service';
export declare class CartItemInput {
    productId: string;
    quantity: number;
}
export declare class CartItem {
    productId: string;
    total: number;
}
export declare class CartCalculationResult {
    items: CartItem[];
    total: number;
}
export declare class OrderNotification {
    id: string;
    message: string;
    imageUrl?: string;
    title?: string;
    route?: string;
    createdAt: Date;
    isRead: boolean;
    userId?: number;
}
export declare class OrdersResolver {
    private ordersService;
    private readonly pubSubService;
    constructor(ordersService: OrdersService, pubSubService: PubserviceService);
    createOrder(input: CreateOrderInput, context: any): Promise<any>;
    cancelOrder(id: string, context: any): Promise<any>;
    reorderFromPrevious(originalOrderId: string, context: any): Promise<any>;
    updateOrderStatus(id: string, input: UpdateOrderStatusInput): Promise<any>;
    order(id: string, context: any): Promise<any>;
    orders(filters: OrderFilters, context: any): Promise<OrderConnection>;
    myOrders(status: OrderStatus, context: any): Promise<any[]>;
    orderStats(): Promise<OrderStats>;
    orderAnalytics(period: string): Promise<OrderAnalytics>;
    calculateCartTotal(items: CartItemInput[]): Promise<CartCalculationResult>;
    userNotification(userId: string): AsyncIterator<unknown, any, any>;
}
export declare class OrderProductResolver {
    imageDetails(product: OrderProduct): Promise<OrderProductImage[]>;
}
