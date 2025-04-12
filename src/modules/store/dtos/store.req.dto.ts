import { ApiProperty } from '@nestjs/swagger';
import { AppCategories } from 'src/shared/enums';

export class StoreReqDto {
  @ApiProperty({
    description: 'Categories of the store',
    example: Object.values(AppCategories),
    enum: Object.values(AppCategories),
  })
  categories: string[];

  @ApiProperty({
    description: 'The logo of the store',
    example: 'https://example.com/logo.png',
  })
  storelogo: string;

  // @ApiProperty({
  //     description: 'The ID of the about schema',
  //     example: '643405452324db8c464c0585',
  // })
  // about: string;
}
