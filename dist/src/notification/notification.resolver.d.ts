import { NotificationService } from './notification.service';
import { Notification } from './notification.entity';
import { PubserviceService } from 'src/pubservice/pubservice.service';
import { OrdersService } from 'src/orders/orders.service';
export declare class NotificationResolver {
    private readonly notificationService;
    private readonly pubSubService;
    private readonly orderService;
    constructor(notificationService: NotificationService, pubSubService: PubserviceService, orderService: OrdersService);
    myNotifications(context: any): Promise<Notification[]>;
    createBroadcastNotification(message: string, route: string, title: string, url: string): Promise<Notification>;
    markNotificationAsRead(id: string, context: any): Promise<Notification>;
    broadcastNotification(): Promise<AsyncIterator<unknown, any, any>>;
}
