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
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const uuid_1 = require("uuid");
const fs = require("fs");
const path = require("path");
let UploadService = class UploadService {
    constructor() {
        this.uploadPath = 'uploads';
        this.ensureUploadDirectory();
    }
    ensureUploadDirectory() {
        const uploadDir = path.join(process.cwd(), this.uploadPath);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const subdirs = ['profiles', 'products', 'shops'];
        subdirs.forEach(subdir => {
            const subdirPath = path.join(uploadDir, subdir);
            if (!fs.existsSync(subdirPath)) {
                fs.mkdirSync(subdirPath, { recursive: true });
            }
        });
    }
    generateFileName(originalName, prefix = '') {
        const fileExtension = (0, path_1.extname)(originalName);
        const uniqueId = (0, uuid_1.v4)();
        return `${prefix}${prefix ? '_' : ''}${uniqueId}${fileExtension}`;
    }
    getUploadPath(subdir = '') {
        return path.join(process.cwd(), this.uploadPath, subdir);
    }
    getFileUrl(filename, subdir = '') {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        return `${baseUrl}/uploads/${subdir}${subdir ? '/' : ''}${filename}`;
    }
    async saveBase64Image(base64Data, filename, subdir = '') {
        try {
            const base64Image = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
            const uploadPath = this.getUploadPath(subdir);
            const filePath = path.join(uploadPath, filename);
            fs.writeFileSync(filePath, base64Image, 'base64');
            return this.getFileUrl(filename, subdir);
        }
        catch (error) {
            throw new Error(`Failed to save image: ${error.message}`);
        }
    }
    async deleteFile(filename, subdir = '') {
        try {
            const filePath = path.join(this.getUploadPath(subdir), filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }
    validateImageFile(file) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024;
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
        }
        if (file.size > maxSize) {
            throw new Error('File size too large. Maximum size is 5MB.');
        }
        return true;
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadService);
//# sourceMappingURL=upload.service.js.map