// upload.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(@Inject('CLOUDINARY') private cloudinaryService: typeof cloudinary) {}

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    console.log(file);
    return new Promise((resolve, reject) => {
      this.cloudinaryService.uploader
        .upload_stream({ folder: 'uploads' }, (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        })
        .end(file.buffer);
    });
  }
}
