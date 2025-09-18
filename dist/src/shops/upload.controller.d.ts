import { UploadService } from '../common/services/upload.service';
interface UploadImageDto {
    base64Image: string;
    shopId: string;
}
export declare class UploadController {
    private uploadService;
    constructor(uploadService: UploadService);
    uploadShopProfileImage(uploadDto: UploadImageDto): Promise<{
        success: boolean;
        imageUrl: string;
        message: string;
    }>;
}
export {};
