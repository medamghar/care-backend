import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from '../common/services/upload.service';

interface UploadImageDto {
  base64Image: string;
  shopId: string;
}

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('shop-profile')
  async uploadShopProfileImage(@Body() uploadDto: UploadImageDto) {
    try {
      const { base64Image, shopId } = uploadDto;

      if (!base64Image || !shopId) {
        throw new BadRequestException('Base64 image and shop ID are required');
      }

      // Generate unique filename
      const filename = this.uploadService.generateFileName(
        'profile.jpg',
        `shop_${shopId}`,
      );

      // Save the image
      const imageUrl = await this.uploadService.saveBase64Image(
        base64Image,
        filename,
        'shops',
      );

      return {
        success: true,
        imageUrl,
        message: 'Image uploaded successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to upload image: ${error.message}`,
      );
    }
  }
}