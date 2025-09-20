import { Resolver, Query, Mutation, Args, ID, Context, Subscription, ObjectType, Field, ResolveField, Parent, InputType, Int, Float } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ShopJwtAuthGuard } from '../auth/guards/shop-jwt-auth.guard';
import {
  Order,
  OrderConnection,
  OrderStats,
  CreateOrderInput,
  UpdateOrderStatusInput,
  OrderFilters,
  OrderStatus,
  OrderAnalytics,
  OrderProduct,
  OrderProductImage,
} from './dto/order.dto';
import { PubserviceService } from 'src/pubservice/pubservice.service';



@InputType()
export class CartItemInput {
  @Field()
  productId: string;

  @Field(() => Int)
  quantity: number;
}

@ObjectType()
export class CartItem {
  @Field()
  productId: string;

  @Field(() => Float)
  total: number;
}

@ObjectType()
export class CartCalculationResult {
  @Field(() => [CartItem])
  items: CartItem[];

  @Field(() => Float)
  total: number;
}
@ObjectType()
export class OrderNotification {
  @Field()
  id: string;

  @Field()
  message: string;

  @Field({ nullable: true })
  imageUrl?: string;
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  route?: string;

  @Field()
  createdAt: Date;

  @Field()
  isRead: boolean;

  @Field({ nullable: true })
  userId?: number;  // nullable for global notifications
}

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private ordersService: OrdersService, private readonly pubSubService: PubserviceService) { }

  // Shop mutations (protected)
  @UseGuards(ShopJwtAuthGuard)
  @Mutation(() => Order)
  async createOrder(
    @Args('input') input: CreateOrderInput,
    @Context() context: any,
  ): Promise<any> {
    try {
      console.log('=== CREATE ORDER DEBUG ===');
      console.log(
        'Context req user:',
        JSON.stringify(context.req?.user, null, 2),
      );
      console.log('Input:', JSON.stringify(input, null, 2));

      const user = context.req.user;

      if (!user) {
        console.log('ERROR: No user in context');
        throw new Error('User not authenticated');
      }

      // Since we're using ShopJwtAuthGuard, we know the user is a shop
      const shopId = user.id;
      console.log('User type:', user.type);
      console.log('Shop ID:', shopId);

      console.log('Calling ordersService.createOrder with shopId:', shopId);
      const result = await this.ordersService.createOrder(shopId, input);
      console.log('Order created successfully with ID:', result?.id);
      return result;
    } catch (error) {
      console.log('=== CREATE ORDER ERROR ===');
      console.log('Error:', error);
      console.log('Error message:', error.message);
      console.log('Error stack:', error.stack);
      throw error;
    }
  }

  @UseGuards(ShopJwtAuthGuard)
  @Mutation(() => Order)
  async cancelOrder(
    @Args('id', { type: () => ID }) id: string,
    @Context() context: any,
  ): Promise<any> {
    const user = context.req.user;
    return this.ordersService.cancelOrder(id, user.id, user.type);
  }

  @UseGuards(ShopJwtAuthGuard)
  @Mutation(() => Order)
  async reorderFromPrevious(
    @Args('originalOrderId', { type: () => ID }) originalOrderId: string,
    @Context() context: any,
  ): Promise<any> {
    const user = context.req.user;
    // Since we're using ShopJwtAuthGuard, we know the user is a shop
    const shopId = user.id;

    return this.ordersService.reorderFromPreviousOrder(originalOrderId, shopId);
  }

  // Admin mutations (protected)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Order)
  async updateOrderStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateOrderStatusInput,
  ): Promise<any> {
    return this.ordersService.updateOrderStatus(id, input);
  }

  // Queries (protected)
  @UseGuards(JwtAuthGuard)
  @Query(() => Order)
  async order(
    @Args('id', { type: () => ID }) id: string,
    @Context() context: any,
  ): Promise<any> {
    const user = context.req.user;
    return this.ordersService.getOrder(id, user.id, user.type);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => OrderConnection)
  async orders(
    @Args('filters', { nullable: true }) filters: OrderFilters,
    @Context() context: any,
  ): Promise<OrderConnection> {
    const user = context.req.user;
    return this.ordersService.getOrders(filters || {}, user.id, user.type);
  }

  @UseGuards(ShopJwtAuthGuard)
  @Query(() => [Order])
  async myOrders(
    @Args('status', { type: () => OrderStatus, nullable: true })
    status: OrderStatus,
    @Context() context: any,
  ): Promise<any[]> {
    const user = context.req.user;
    // Since we're using ShopJwtAuthGuard, we know the user is a shop
    const shopId = user.id;

    return this.ordersService.getShopOrders(shopId, status);
  }

  // Admin queries (protected)
  @UseGuards(JwtAuthGuard)
  @Query(() => OrderStats)
  async orderStats(): Promise<OrderStats> {
    return this.ordersService.getOrderStats();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => OrderAnalytics)
  async orderAnalytics(
    @Args('period', { defaultValue: 'month' }) period: string,
  ): Promise<OrderAnalytics> {
    return this.ordersService.getOrderAnalytics(period);
  }
  @Query(() => CartCalculationResult, { name: 'calculateCartTotal' })
  async calculateCartTotal(
    @Args('items', { type: () => [CartItemInput] }) items: CartItemInput[],
  ): Promise<CartCalculationResult> {
    return this.ordersService.calculateCartTotal(items);
  }


  @UseGuards(ShopJwtAuthGuard)
  @Subscription(() => OrderNotification, {
    filter: (payload, variables) => {
      return payload.userNotification.userId === variables.userId; // Only allow the logged-in user to receive the notification
    }
  })
  userNotification(@Args("userId", { type: () => String }) userId: string) {
    return this.pubSubService.asyncIterator(`userNotification_${userId}`);
  }
  


}


@Resolver(() => OrderProduct)
export class OrderProductResolver {
  @ResolveField(() => [OrderProductImage], { nullable: true })
  async imageDetails(@Parent() product: OrderProduct): Promise<OrderProductImage[]> {
    // Return the images directly since they're now OrderProductImage objects
    return product.images || [];
  }



}
