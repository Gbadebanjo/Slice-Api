import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Identifier } from 'src/shared/types';

@Schema({
  timestamps: true,
  // timestamps:{createdAt:'created
})
export class Profile {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '643405452324db8c464c0584',
  })
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  })
  _id?: Types.ObjectId;

  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '643405452324db8c464c0584',
  })
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  user: Types.ObjectId;

  @ApiProperty({
    description: 'The name of the store',
    example: 'My Store',
  })
  @Prop({
    type: String,
    required: true,
  })
  storeName: string;

  @ApiProperty({
    description: 'The description of the store',
    example: 'A great store for all your needs',
  })
  @Prop({
    type: String,
    required: false,
  })
  storeDescription?: string;

  @ApiProperty({
    description: 'The phone number of the store',
    example: '+1234567890',
  })
  @Prop({
    type: String,
    required: true,
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'The address of the store',
    example: '123 Main St',
  })
  @Prop({
    type: String,
    required: true,
  })
  address: string;

  @ApiProperty({
    description: 'The city where the store is located',
    example: 'New York',
  })
  @Prop({
    type: String,
    required: true,
  })
  city: string;

  @ApiProperty({
    description: 'The state where the store is located',
    example: 'NY',
  })
  @Prop({
    type: String,
    required: true,
  })
  state: string;
}

export type ProfileIdentifier = Identifier | Profile;

export type ProfileDocument = HydratedDocument<Profile>;
export const ProfileSchema = SchemaFactory.createForClass(Profile);

ProfileSchema.index({ user: 1 });
