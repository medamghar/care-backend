import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver, OrderProductResolver } from './orders.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  providers: [OrdersService, OrdersResolver, OrderProductResolver],
  exports: [OrdersService],
})
export class OrdersModule {}
