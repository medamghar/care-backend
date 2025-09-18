export declare enum OrderStatus {
    NEW = "NEW",
    CONFIRMED = "CONFIRMED",
    PROCESSING = "PROCESSING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED"
}
export declare class OrderRole {
    id: string;
    name: string;
}
export declare class OrderUser {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role?: OrderRole;
}
export declare class OrderCategory {
    id: string;
    nameAr: string;
    nameFr: string;
}
export declare class OrderBrand {
    id: string;
    name: string;
    logoUrl: string;
}
export declare class OrderPriceTier {
    id: string;
    minQuantity: number;
    pricePerUnit: number;
}
export declare class OrderProductImage {
    id: string;
    imageUrl: string;
    sortOrder: number;
    isPrimary: boolean;
}
export declare class OrderProduct {
    id: string;
    sku: string;
    nameAr: string;
    nameFr: string;
    descriptionAr?: string;
    descriptionFr?: string;
    basePrice: number;
    currentStock: number;
    images?: OrderProductImage[];
    imageDetails?: OrderProductImage[];
    category?: OrderCategory;
    brand?: OrderBrand;
    priceTiers?: OrderPriceTier[];
}
export declare class OrderItem {
    id: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product: OrderProduct;
}
export declare class OrderShop {
    id: string;
    nameAr: string;
    nameFr?: string;
    ownerName: string;
    phone: string;
    city: string;
    address: string;
    profileImage?: string;
}
export declare class Order {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
    notes?: string;
    createdAt: Date;
    processedAt?: Date;
    deliveredAt?: Date;
    updatedAt?: Date;
    shop: OrderShop;
    items: OrderItem[];
    statusHistory?: OrderStatusHistory[];
}
export declare class OrderItemInput {
    productId: string;
    quantity: number;
}
export declare class CreateOrderInput {
    items: OrderItemInput[];
    notes?: string;
}
export declare class UpdateOrderStatusInput {
    status: OrderStatus;
}
export declare class OrderConnection {
    orders: any[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}
export declare class OrderFilters {
    status?: OrderStatus;
    shopId?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
}
export declare class OrderStats {
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    deliveredOrders: number;
    totalRevenue: number;
    todayRevenue: number;
}
export declare class OrderStatusCount {
    status: string;
    count: number;
    percentage: number;
}
export declare class RevenueByDay {
    date: string;
    revenue: number;
    orders: number;
}
export declare class TopProduct {
    product: OrderProduct;
    totalSold: number;
    revenue: number;
}
export declare class TopShop {
    shop: OrderShop;
    totalOrders: number;
    totalRevenue: number;
}
export declare class OrderAnalytics {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    ordersByStatus: OrderStatusCount[];
    revenueByDay: RevenueByDay[];
    topProducts: TopProduct[];
    topShops: TopShop[];
}
export declare class OrderStatusHistory {
    id: string;
    status: OrderStatus;
    notes?: string;
    createdAt: Date;
    updatedBy: OrderUser;
}
