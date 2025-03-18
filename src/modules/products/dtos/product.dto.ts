import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Identifier } from 'src/shared/types';

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
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Product price',
    required: true,
  })
  price: number;

  @ApiProperty({
    type: String,
    description: 'Product image URL',
    required: true,
  })
  image: string;

  //   @ApiProperty({
  //     type: Types.ObjectId,
  //     description: 'Store reference',
  //     required: false,
  //   })
  store?: Identifier;

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
}
