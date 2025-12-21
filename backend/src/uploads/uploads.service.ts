import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Express } from 'express';

@Injectable()
export class UploadsService {
  private s3Client: S3Client;
  private bucketName = process.env.AWS_BUCKET_NAME;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async uploadFile(file: Express.Multer.File) {
    // Mock upload if constraints are missing for dev
    if (!process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID === 'AKIA...') {
      console.warn('AWS Credentials missing. Returning real placeholder for testing.');
      // Using a real square logo placeholder so the 3D texture actually loads
      return {
        url: `https://picsum.photos/seed/${Date.now()}/512`,
        key: `mock-${Date.now()}.png`
      };
    }

    try {
      const key = `${Date.now()}-${file.originalname}`;

      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read', // Ensure bucket policy allows this or use presigned URLs
        },
      });

      await upload.done();

      return {
        url: `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        key: key,
      };
    } catch (e) {
      console.error('S3 Upload Error', e);
      throw new Error('File upload failed');
    }
  }
}
