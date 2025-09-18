import {
  ObjectType,
  Field,
  ID,
  InputType,
  Int,
  Float,
  registerEnumType,
} from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  Min,
} from 'class-validator';

export enum OrderStatus {
  NEW = 'NEW',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

@ObjectType()
export class OrderRole {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
}

@ObjectType()
export class OrderUser {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone?: string;

  @Field(() => OrderRole, { nullable: true })
  role?: OrderRole;
}

@ObjectType()
export class OrderCategory {
  @Field(() => ID)
  id: string;

  @Field()
  nameAr: string;

  @Field()
  nameFr: string;
}

@ObjectType()
export class OrderBrand {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  logoUrl: string;
}

@ObjectType()
export class OrderPriceTier {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  minQuantity: number;

  @Field(() => Float)
  pricePerUnit: number;
}

@ObjectType()
export class OrderProductImage {
  @Field(() => ID)
  id: string;

  @Field()
  imageUrl: string;

  @Field(() => Int)
  sortOrder: number;

  @Field()
  isPrimary: boolean;
}

@ObjectType()
export class OrderProduct {
  @Field(() => ID)
  id: string;

  @Field()
  sku: string;

  @Field()
  nameAr: string;

  @Field()
  nameFr: string;

  @Field({ nullable: true })
  descriptionAr?: string;

  @Field({ nullable: true })
  descriptionFr?: string;

  @Field(() => Float)
  basePrice: number;

  @Field(() => Int)
  currentStock: number;

  @Field(() => [OrderProductImage], { nullable: true })
  images?: OrderProductImage[];

  @Field(() => [OrderProductImage], { nullable: true })
  imageDetails?: OrderProductImage[];

  @Field(() => OrderCategory, { nullable: true })
  category?: OrderCategory;

  @Field(() => OrderBrand, { nullable: true })
  brand?: OrderBrand;

  @Field(() => [OrderPriceTier], { nullable: true })
  priceTiers?: OrderPriceTier[];
}

@ObjectType()
export class OrderItem {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  unitPrice: number;

  @Field(() => Float)
  totalPrice: number;

  @Field(() => OrderProduct)
  product: OrderProduct;
}

@ObjectType()
export class OrderShop {
  @Field(() => ID)
  id: string;

  @Field()
  nameAr: string;

  @Field({ nullable: true })
  nameFr?: string;

  @Field()
  ownerName: string;

  @Field()
  phone: string;

  @Field()
  city: string;

  @Field()
  address: string;

  @Field({ nullable: true })
  profileImage?: string;
}

@ObjectType()
export class Order {
  @Field(() => ID)
  id: string;

  @Field()
  orderNumber: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => Float)
  subtotal: number;

  @Field(() => Float)
  discountAmount: number;

  @Field(() => Float)
  taxAmount: number;

  @Field(() => Float)
  totalAmount: number;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  processedAt?: Date;

  @Field({ nullable: true })
  deliveredAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field(() => OrderShop)
  shop: OrderShop;

  @Field(() => [OrderItem])
  items: OrderItem[];

  @Field(() => [OrderStatusHistory], { nullable: true })
  statusHistory?: OrderStatusHistory[];
}

@InputType()
export class OrderItemInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  productId: string;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  quantity: number;
}

@InputType()
export class CreateOrderInput {
  @Field(() => [OrderItemInput])
  items: OrderItemInput[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}

@InputType()
export class UpdateOrderStatusInput {
  @Field(() => OrderStatus)
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

@ObjectType()
export class OrderConnection {
  @Field(() => [Order])
  orders: any[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field()
  hasMore: boolean;
}

@InputType()
export class OrderFilters {
  @Field(() => OrderStatus, { nullable: true })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  shopId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  dateFrom?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  dateTo?: string;

  @Field(() => Int, { defaultValue: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @Field(() => Int, { defaultValue: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;
}

@ObjectType()
export class OrderStats {
  @Field(() => Int)
  totalOrders: number;

  @Field(() => Int)
  pendingOrders: number;

  @Field(() => Int)
  processingOrders: number;

  @Field(() => Int)
  deliveredOrders: number;

  @Field(() => Float)
  totalRevenue: number;

  @Field(() => Float)
  todayRevenue: number;
}

@ObjectType()
export class OrderStatusCount {
  @Field()
  status: string;

  @Field(() => Int)
  count: number;

  @Field(() => Float)
  percentage: number;
}

@ObjectType()
export class RevenueByDay {
  @Field()
  date: string;

  @Field(() => Float)
  revenue: number;

  @Field(() => Int)
  orders: number;
}

@ObjectType()
export class TopProduct {
  @Field(() => OrderProduct)
  product: OrderProduct;

  @Field(() => Int)
  totalSold: number;

  @Field(() => Float)
  revenue: number;
}

@ObjectType()
export class TopShop {
  @Field(() => OrderShop)
  shop: OrderShop;

  @Field(() => Int)
  totalOrders: number;

  @Field(() => Float)
  totalRevenue: number;
}

@ObjectType()
export class OrderAnalytics {
  @Field(() => Int)
  totalOrders: number;

  @Field(() => Float)
  totalRevenue: number;

  @Field(() => Float)
  averageOrderValue: number;

  @Field(() => [OrderStatusCount])
  ordersByStatus: OrderStatusCount[];

  @Field(() => [RevenueByDay])
  revenueByDay: RevenueByDay[];

  @Field(() => [TopProduct])
  topProducts: TopProduct[];

  @Field(() => [TopShop])
  topShops: TopShop[];
}

@ObjectType()
export class OrderStatusHistory {
  @Field(() => ID)
  id: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  createdAt: Date;

  @Field(() => OrderUser)
  updatedBy: OrderUser;
}
