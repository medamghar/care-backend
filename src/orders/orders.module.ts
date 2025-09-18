import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver, OrderProductResolver } from './orders.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { PubserviceService } from 'src/pubservice/pubservice.service';

@Module({
  imports: [PrismaModule, ],
  providers: [OrdersService, OrdersResolver, OrderProductResolver, PubserviceService],
  exports: [OrdersService],
})
export class OrdersModule {}
