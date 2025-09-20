import { Resolver, Query, Mutation, Subscription, Args, Context, } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification } from './notification.entity';
import { PubserviceService } from 'src/pubservice/pubservice.service';
import { OrdersService } from 'src/orders/orders.service';
import { UseGuards } from '@nestjs/common';
import { ShopJwtAuthGuard } from 'src/auth/guards/shop-jwt-auth.guard';
import { OrderNotification } from 'src/orders/orders.resolver';


@Resolver(() => Notification)
export class NotificationResolver {

    constructor(private readonly notificationService: NotificationService, private readonly pubSubService: PubserviceService, private readonly orderService: OrdersService) {

    }

    @Query(() => [Notification])
    async myNotifications(@Context() context) {
         const user = context.req.user;
         console.log(user)
        return this.notificationService.findMyNotifications("cmfn4lmkr001mt4xs3y3da67w");
    }

    @Mutation(() => Notification)
    async createBroadcastNotification(
        @Args('message') message: string,
        @Args('route') route: string,
        @Args('title') title: string,
        @Args('url') url: string,
    ) {
        const notification = await this.notificationService.createBroadcastNotification(
            message,
            route,
            title,
            url
        );



        return notification;
    }

  @UseGuards(ShopJwtAuthGuard)
    @Mutation(() => Notification)
    async markNotificationAsRead(
        @Args('id') id: string,
        @Context() context,
    ) {
        console.log(context.req.user)
                 const shopId = context.req.user.id;

        return this.notificationService.markAsRead(id,shopId);
    }







    // @Subscription(() => OrderNotification, {
    //     filter: (payload) => {
    //         // The filter should return true to allow the notification through
    //         return Boolean(payload.broadcastNotification);
    //     },
    //     // Optionally resolve the payload if needed
    //     resolve: (payload) => {
    //         return payload.broadcastNotification;
    //     }
    // })
    // async broadcastNotification() {
    //                 console.log('Subscription filter payload:');

    //     return this.pubSubService.asyncIterator('broadcastNotification');
    // }
    @Subscription(() => OrderNotification)
      broadcastNotification() {
        console.log('broadcastNotification subscription method called!');
        console.log('PubSubService available:', !!this.pubSubService);
    
        const iterator = this.pubSubService.asyncIterator('broadcastNotification');
        console.log('Iterator created:', !!iterator);
        return iterator;
      }
}
