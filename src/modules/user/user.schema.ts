import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { DatabaseCollectionNames } from '../../shared/enums';
import { Identifier } from '../../shared/types';

@Schema({
  timestamps: true,
  // timestamps:{createdAt:'created_at',updatedAt:'updated_at'},
  collection: DatabaseCollectionNames.USER,
})
export class User {
  // _id is the unique identifier of the user
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '643405452324db8c464c0584',
  })
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  })
  _id?: Types.ObjectId;

  // email is the unique identifier of the user
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 'john@example.com',
  })
  @Prop({
    required: true,
  })
  email: string;

  // password is the hashed password of the user
  @ApiHideProperty()
  @Prop()
  password?: string;

  // name is the full name of the user
  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  @Prop()
  name: string;

  // verified is a boolean value that indicates whether the user has verified their email address
  @ApiProperty({
    description: 'Indicates whether the user has verified their email address',
    example: true,
  })
  @Prop({
    type: MongooseSchema.Types.Boolean,
    default: false,
  })
  verified: boolean;

  // Account type of the user. Can be either "buyer" or "vendor"
  @ApiProperty({
    description: 'The account type of the user',
    example: 'buyer',
  })
  @Prop()
  accountType: string;

  // verificationCode is a 6-digit number that is sent to the user's email address to verify their email address
  @ApiHideProperty()
  @Prop({
    type: MongooseSchema.Types.Number,
  })
  verificationCode?: number;

  @ApiHideProperty()
  @Prop()
  resetToken?: string;

  // registerCode is used for when user is going to reset password or change password perform at time all same user login session will be logout
  @ApiHideProperty()
  @Prop({
    type: MongooseSchema.Types.Number,
  })
  registerCode?: number;
}

export type UserIdentifier = Identifier | User;

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1, isActive: 1 });
