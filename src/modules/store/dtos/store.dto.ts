import { ApiProperty } from '@nestjs/swagger';
import { Identifier } from 'src/shared/types';

export class StoreDto {
  @ApiProperty({
    description: 'The ID of the store',
    example: '643405452324db8c464c0584',
  })
  _id?: Identifier;

  @ApiProperty({
    description: 'The Profile of the store',
    example: {
      profile: {
        _id: '643405452324db8c464c0584',
        user: '643405452324db8c464c0584',
        storeName: 'My Store',
        storeDescription: 'A great store for all your needs',
        phoneNumber: '+1234567890',
      },
    },
  })
  profile: {
    _id?: Identifier;
    user?: Identifier;
    storeName?: string;
    storeDescription?: string;
    phoneNumber?: string;
  };

  @ApiProperty({
    description: 'Categories of the store',
    example: ['Electronics', 'Books'],
  })
  categories: string[];

  @ApiProperty({
    description: 'The logo of the store',
    example: 'https://example.com/logo.png',
  })
  storelogo: string;

  @ApiProperty({
    description: 'The ID of the about schema',
    example: '643405452324db8c464c0585',
  })
  about: Identifier;
}
