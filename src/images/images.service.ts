import { Injectable, BadRequestException } from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync, statSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UploadResponse } from 'src/common/dto/upload-response.dto';
import { FileUpload } from 'graphql-upload-ts';

@Injectable()
export class ImageService {
  private readonly uploadPath = join(process.cwd(), 'uploads');
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  constructor() {
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadSingleImage(filePromise: Promise<FileUpload>): Promise<UploadResponse> {
    const file = await filePromise;
    const { createReadStream, filename, mimetype, encoding } = file;

    // Validate file type
    if (!this.allowedMimeTypes.includes(mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`
      );
    }

    // Generate unique filename
    const fileExtension = filename.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const filePath = join(this.uploadPath, uniqueFilename);

    return new Promise((resolve, reject) => {
      const stream = createReadStream();
      const writeStream = createWriteStream(filePath);
      let fileSize = 0;

      stream.on('data', (chunk) => {
        fileSize += chunk.length;
        if (fileSize > this.maxFileSize) {
          writeStream.destroy();
          reject(new BadRequestException('File size exceeds 5MB limit'));
          return;
        }
      });

      stream
        .pipe(writeStream)
        .on('finish', () => {
          const stats = statSync(filePath);
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
          reject(new BadRequestException(`Upload failed: ${error.message}`));
        });
    });
  }

  async uploadMultipleImages(
    filesPromise: Promise<FileUpload>[]
  ): Promise<UploadResponse[]> {
    const uploadPromises = filesPromise.map((filePromise) =>
      this.uploadSingleImage(filePromise)
    );

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new BadRequestException(`Batch upload failed: ${error.message}`);
    }
  }
}