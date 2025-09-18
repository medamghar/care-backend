export declare class UploadService {
    private readonly uploadPath;
    constructor();
    private ensureUploadDirectory;
    generateFileName(originalName: string, prefix?: string): string;
    getUploadPath(subdir?: string): string;
    getFileUrl(filename: string, subdir?: string): string;
    saveBase64Image(base64Data: string, filename: string, subdir?: string): Promise<string>;
    deleteFile(filename: string, subdir?: string): Promise<boolean>;
    validateImageFile(file: Express.Multer.File): boolean;
}
