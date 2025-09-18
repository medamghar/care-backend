import { Module } from '@nestjs/common';
import { ImageService } from './images.service';

@Module({
  providers: [ImageService]
})
export class ImagesModule {}
