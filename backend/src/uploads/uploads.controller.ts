import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import type { Express } from 'express';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.uploadsService.uploadFile(file);
  }
}
