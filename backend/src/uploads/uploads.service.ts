import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import toStream from 'buffer-to-stream';
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
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'beyondtee_designs' },
        (error, result) => {
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

      // Convert buffer to stream and pipe it to cloudinary
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      toStream(file.buffer).pipe(upload);
    });
  }
}
