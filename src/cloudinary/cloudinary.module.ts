import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './provider';
import { UploadService } from './cloudinary.service';

@Module({
  imports: [],
  providers: [CloudinaryProvider, UploadService],
  exports: [CloudinaryProvider, UploadService],
})
export class CloudinaryModule {}
