import { Module } from '@nestjs/common';
import { NotificationResolver } from './notification.resolver';
import { NotificationService } from './notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PubSub } from 'graphql-subscriptions';
import { PubserviceService } from 'src/pubservice/pubservice.service';
import { OrdersService } from 'src/orders/orders.service';

@Module({
  providers: [NotificationResolver, NotificationService,PrismaService ,PubSub ,PubserviceService ,OrdersService]
})
export class NotificationModule {}
