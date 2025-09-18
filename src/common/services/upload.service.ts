import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly uploadPath = 'uploads';

  constructor() {
    // Ensure upload directory exists
    this.ensureUploadDirectory();
  }

  private ensureUploadDirectory() {
    const uploadDir = path.join(process.cwd(), this.uploadPath);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Create subdirectories for different types
    const subdirs = ['profiles', 'products', 'shops'];
    subdirs.forEach(subdir => {
      const subdirPath = path.join(uploadDir, subdir);
      if (!fs.existsSync(subdirPath)) {
        fs.mkdirSync(subdirPath, { recursive: true });
      }
    });
  }

  generateFileName(originalName: string, prefix: string = ''): string {
    const fileExtension = extname(originalName);
    const uniqueId = uuidv4();
    return `${prefix}${prefix ? '_' : ''}${uniqueId}${fileExtension}`;
  }

  getUploadPath(subdir: string = ''): string {
    return path.join(process.cwd(), this.uploadPath, subdir);
  }

  getFileUrl(filename: string, subdir: string = ''): string {
    // In production, this would be your CDN or file server URL
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads/${subdir}${subdir ? '/' : ''}${filename}`;
  }

  async saveBase64Image(
    base64Data: string,
    filename: string,
    subdir: string = ''
  ): Promise<string> {
    try {
      // Remove data URL prefix if present
      const base64Image = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
      
      const uploadPath = this.getUploadPath(subdir);
      const filePath = path.join(uploadPath, filename);
      
      // Save the file
      fs.writeFileSync(filePath, base64Image, 'base64');
      
      return this.getFileUrl(filename, subdir);
    } catch (error) {
      throw new Error(`Failed to save image: ${error.message}`);
    }
  }

  async deleteFile(filename: string, subdir: string = ''): Promise<boolean> {
    try {
      const filePath = path.join(this.getUploadPath(subdir), filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  validateImageFile(file: Express.Multer.File): boolean {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    return true;
  }
}