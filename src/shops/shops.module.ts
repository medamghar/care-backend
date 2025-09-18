import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ShopsResolver } from './shops.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { ImageService } from 'src/images/images.service';

@Module({
  providers: [ShopsService, ShopsResolver, PrismaService,ImageService],
  exports: [ShopsService],
})
export class ShopsModule {}
