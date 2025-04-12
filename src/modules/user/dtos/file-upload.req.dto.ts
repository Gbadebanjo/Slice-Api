import { ApiProperty } from '@nestjs/swagger';

export class FileUploadReqDto {
  @ApiProperty({
    description: 'The file to be uploaded',
    type: 'string',
    format: 'binary',
  })
  file: Express.Multer.File;
}
