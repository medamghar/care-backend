import { Resolver, Query, Mutation, Subscription, Args, Context, } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification } from './notification.entity';
import { PubserviceService } from 'src/pubservice/pubservice.service';
import { OrdersService } from 'src/orders/orders.service';


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


    @Mutation(() => Notification)
    async markNotificationAsRead(
        @Args('id') id: string,
        @Context() context,
    ) {
                 const shopId = context.req.user.id;

        return this.notificationService.markAsRead(id,shopId);
    }







    @Subscription(() => Notification, {
        filter: (payload) => {
            console.log('Subscription filter payload:', payload);
            // The filter should return true to allow the notification through
            return Boolean(payload.broadcastNotification);
        },
        // Optionally resolve the payload if needed
        resolve: (payload) => {
            console.log('Resolving payload:', payload);
            return payload.broadcastNotification;
        }
    })
    async broadcastNotification() {
        return this.pubSubService.asyncIterator('broadcastNotification');
    }
}
