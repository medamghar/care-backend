import { UploadResponse } from 'src/common/dto/upload-response.dto';
import { FileUpload } from 'graphql-upload-ts';
export declare class ImageService {
    private readonly uploadPath;
    private readonly maxFileSize;
    private readonly allowedMimeTypes;
    constructor();
    uploadSingleImage(filePromise: Promise<FileUpload>): Promise<UploadResponse>;
    uploadMultipleImages(filesPromise: Promise<FileUpload>[]): Promise<UploadResponse[]>;
}
