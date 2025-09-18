import { PrismaService } from '../prisma/prisma.service';
import { Notification } from './notification.entity';
import { PubserviceService } from 'src/pubservice/pubservice.service';
export declare class NotificationService {
    private prisma;
    private readonly pubSubService;
    constructor(prisma: PrismaService, pubSubService: PubserviceService);
    findMyNotifications(userId: string): Promise<Notification[]>;
    markAsRead(id: string, userId: string): Promise<Notification>;
    createBroadcastNotification(message: any, route: any, title: any, url: any): Promise<Notification>;
}
