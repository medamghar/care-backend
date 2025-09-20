import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { ImageService } from 'src/images/images.service';
import { NotificationService } from 'src/notification/notification.service';
import { PubserviceService } from 'src/pubservice/pubservice.service';

@Module({
  imports: [PrismaModule ],
  providers: [ProductsService, ProductsResolver,ImageService,NotificationService,PubserviceService],
  exports: [ProductsService],
})
export class ProductsModule {}
