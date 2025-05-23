import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { AppCategories } from 'src/shared/enums';
// import { Identifier } from 'src/shared/types';

export class ProductDto {
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
    example: 'Suitcase',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Product price',
    required: true,
    example: 290,
  })
  price: number;

  @ApiProperty({
    type: String,
    description: 'Product image URLs',
    required: false,
  })
  images: string[];

  // @ApiProperty({
  //   type: Types.ObjectId,
  //   description: 'Store reference',
  //   required: false,
  // })
  // store?: Identifier;

  @ApiProperty({
    type: [String],
    description: 'Product categories',
    required: true,
    enum: Object.values(AppCategories),
    maxLength: 1,
    maximum: 1,
    example: Object.values(AppCategories),
  })
  category: string[];

  @ApiProperty({
    type: [String],
    description: 'Available color variations',
    required: false,
    example: ['red', 'blue', 'green'],
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

  @ApiHideProperty()
  ratings?: number;
}
