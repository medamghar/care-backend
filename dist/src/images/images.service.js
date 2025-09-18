"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const uuid_1 = require("uuid");
let ImageService = class ImageService {
    constructor() {
        this.uploadPath = (0, path_1.join)(process.cwd(), 'uploads');
        this.maxFileSize = 5 * 1024 * 1024;
        this.allowedMimeTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
        ];
        if (!(0, fs_1.existsSync)(this.uploadPath)) {
            (0, fs_1.mkdirSync)(this.uploadPath, { recursive: true });
        }
    }
    async uploadSingleImage(filePromise) {
        const file = await filePromise;
        const { createReadStream, filename, mimetype, encoding } = file;
        if (!this.allowedMimeTypes.includes(mimetype)) {
            throw new common_1.BadRequestException(`Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`);
        }
        const fileExtension = filename.split('.').pop();
        const uniqueFilename = `${(0, uuid_1.v4)()}.${fileExtension}`;
        const filePath = (0, path_1.join)(this.uploadPath, uniqueFilename);
        return new Promise((resolve, reject) => {
            const stream = createReadStream();
            const writeStream = (0, fs_1.createWriteStream)(filePath);
            let fileSize = 0;
            stream.on('data', (chunk) => {
                fileSize += chunk.length;
                if (fileSize > this.maxFileSize) {
                    writeStream.destroy();
                    reject(new common_1.BadRequestException('File size exceeds 5MB limit'));
                    return;
                }
            });
            stream
                .pipe(writeStream)
                .on('finish', () => {
                const stats = (0, fs_1.statSync)(filePath);
                resolve({
                    filename: uniqueFilename,
                    originalName: filename,
                    url: `/uploads/${uniqueFilename}`,
                    path: filePath,
                    size: stats.size,
                    mimetype,
                });
            })
                .on('error', (error) => {
                reject(new common_1.BadRequestException(`Upload failed: ${error.message}`));
            });
        });
    }
    async uploadMultipleImages(filesPromise) {
        const uploadPromises = filesPromise.map((filePromise) => this.uploadSingleImage(filePromise));
        try {
            return await Promise.all(uploadPromises);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Batch upload failed: ${error.message}`);
        }
    }
};
exports.ImageService = ImageService;
exports.ImageService = ImageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ImageService);
//# sourceMappingURL=images.service.js.map