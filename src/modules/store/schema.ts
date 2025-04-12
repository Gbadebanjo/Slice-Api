import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { AppCategories } from 'src/shared/enums';

@Schema({
  timestamps: true,
})
export class Store {
  @ApiProperty({
    description: 'The unique identifier of the store',
    example: '643405452324db8c464c0584',
  })
  @Prop({
    required: true,
    default: () => new Types.ObjectId(),
  })
  _id?: Types.ObjectId;

  @ApiProperty({
    description: 'The profile id of the user',
    example: 'John Doe',
  })
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Profile',
  })
  profile: Types.ObjectId;

  @ApiProperty({
    description: 'Categories of the store',
    example: ['Electronics', 'Books'],
    enum() {
      return Object.values(AppCategories);
    },
  })
  @Prop({
    required: true,
    type: [String],
    enum: Object.values(AppCategories),
  })
  categories: string[];

  @ApiProperty({
    description: 'The logo of the store',
    example: 'https://example.com/logo.png',
  })
  @Prop({
    required: true,
    type: String,
  })
  storelogo: string;

  @ApiProperty({
    description: 'The ID of the about schema',
    example: '643405452324db8c464c0585',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'About',
  })
  about: Types.ObjectId;

  @ApiProperty({
    description: 'The ID of the review schema',
    example: '643405452324db8c464c0586',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Review',
  })
  review?: Types.ObjectId;
}

export type StoreDocument = HydratedDocument<Store>;
export const StoreSchema = SchemaFactory.createForClass(Store);

StoreSchema.index({ profile: 1 }, { unique: true });
