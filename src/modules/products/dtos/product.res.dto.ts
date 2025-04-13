import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Identifier } from 'src/shared/types';

export class ProductResDto {
  @ApiProperty({
    type: Types.ObjectId,
    description: 'Product ID',
    required: false,
  })
  id?: string;

  @ApiProperty({
    type: String,
    description: 'Product name',
    required: true,
  })
  name: string;

  @ApiProperty({
    type: Number,
    description: 'Product price',
    required: true,
  })
  price: number;

  @ApiProperty({
    type: String,
    description: 'Product image URL',
    required: true,
  })
  images: string;

  @ApiProperty({
    description: 'Store Details',
    example: {
      _id: '643405452324db8c464c0584',
      profile: {
        _id: '643405452324db8c464c0584',
        user: '643405452324db8c464c0584',
        storeName: 'My Store',
        storeDescription: 'A great store for all your needs',
        phoneNumber: '+1234567890',
      },
      categories: ['Electronics', 'Books'],
      storelogo: 'https://example.com/logo.png',
      about: '643405452324db8c464c058',
    },
  })
  store: {
    _id: Identifier;
    profile: {
      _id: Identifier;
      user: Identifier;
      storeName: string;
      storeDescription: string;
      phoneNumber: string;
    };
    categories: string[];
    storelogo: string;
    about: Identifier;
  };

  @ApiProperty({
    type: [String],
    description: 'Product categories',
    required: true,
  })
  category: string[];

  @ApiProperty({
    type: [String],
    description: 'Available color variations',
    required: false,
  })
  colorVariations?: string[];

  @ApiProperty({
    type: String,
    description: 'Product description',
    required: true,
  })
  description: string;

  @ApiProperty({
    description: 'The holding period of the product in days',
    example: 30,
  })
  holdingPeriod?: number;

  @ApiProperty({
    description: 'Indicates if a discount is available for the product',
    example: true,
  })
  discountAvailable?: boolean;

  @ApiProperty({
    description: 'The discount value in percentage',
    example: 15,
  })
  discountValue?: number;

  @ApiProperty({
    type: [String],
    description: 'Array of user IDs who liked the product',
    required: false,
  })
  likes?: string[];
}
