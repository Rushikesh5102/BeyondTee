import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';
import { Express } from 'express';

@Injectable()
export class UploadsService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      // Mock upload for local testing if Cloudinary is not configured
      console.log('Using Mock Upload (Cloudinary Not Configured)');
      return {
        url: 'https://via.placeholder.com/800x800.png?text=Mock+Upload',
        key: `mock-${Date.now()}`,
      };
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'beyondtee_designs' },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            return reject(new BadRequestException('Failed to upload image'));
          }
          if (result) {
            resolve({
              url: result.secure_url,
              key: result.public_id,
            });
          } else {
            reject(
              new BadRequestException('Failed to upload image - No result'),
            );
          }
        },
      );

      // Robust stream conversion
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
