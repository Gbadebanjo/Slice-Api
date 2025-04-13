import { Schema as NestSchema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { AppCategories } from 'src/shared/enums';
import { Identifier } from 'src/shared/types';

@NestSchema({
  timestamps: true,
})
export class Product {
  @ApiProperty({
    description: 'The unique identifier of the product',
    example: '643405452324db8c464c0584',
  })
  @Prop({
    required: true,
    default: () => new Types.ObjectId(),
  })
  _id?: Types.ObjectId;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Product Name',
  })
  @Prop({
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 29.99,
  })
  @Prop({
    required: true,
  })
  price: number;

  @ApiProperty({
    description: 'The image URL of the product',
    example: 'http://example.com/image.jpg',
  })
  @Prop({
    required: true,
  })
  images: string[];

  @ApiProperty({
    description: 'The holding period of the product in days',
    example: 30,
  })
  @Prop({
    required: false,
  })
  holdingPeriod?: number;

  @ApiProperty({
    description: 'Indicates if a discount is available for the product',
    example: true,
  })
  @Prop({
    required: false,
    default: false,
  })
  discountAvailable?: boolean;

  @ApiProperty({
    description: 'The discount value in percentage',
    example: 15,
  })
  @Prop({
    required: false,
    min: 0,
    max: 100,
  })
  discountValue?: number;

  @ApiProperty({
    description: 'The store reference of the product',
    example: '643405452324db8c464c0584',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Store',
    required: true,
  })
  store: Types.ObjectId;

  @ApiProperty({
    description: 'The category of the product',
    example: ['Electronics', 'Gadgets'],
    enum: () => {
      return Object.values(AppCategories);
    },
  })
  @Prop({
    type: [String],
    required: true,
    enum: Object.values(AppCategories),
  })
  category: string[];

  @ApiProperty({
    description: 'The colors available for the product',
    example: ['Red', 'Blue'],
  })
  @Prop({
    type: [String],
    required: false,
  })
  colorVariations?: string[];

  @ApiProperty({
    description: 'The description of the product',
    example: 'This is a great product.',
  })
  @Prop({
    required: true,
  })
  description: string;

  @ApiProperty({
    description: 'The likes of the product',
    example: ['643405452324db8c464c0584', '643405452324db8c464c0585'],
  })
  @Prop({
    type: [Types.ObjectId],
    ref: 'User',
    required: false,
  })
  likes?: Types.ObjectId[];

  @ApiProperty({
    description: 'The status of the product',
    example: 'active',
  })
  @Prop({
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: 'active' | 'inactive';

  // @ApiProperty({
  //   description: 'The quantity of the product',
  //   example: 100,
  // })
  // @Prop({
  //   required: true,
  // })
  // quantity: number;

  // @ApiProperty({

  // })
  // outOfStock?: boolean;
}

export type ProductIdentifier = Identifier | Product;

export type ProductDocument = HydratedDocument<Product>;

export const ProductSchema = SchemaFactory.createForClass(Product);
