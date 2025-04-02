import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Cart {
  @ApiProperty({
    type: Types.ObjectId,
    // default: () => new Types.ObjectId(),
    description: 'Cart Id',
  })
  @Prop({ type: Types.ObjectId, required: true, default: () => new Types.ObjectId() })
  _id?: Types.ObjectId;

  @ApiProperty({
    type: Types.ObjectId,
    description: 'Item ID',
  })
  @Prop({ type: Types.ObjectId, required: true, refPath: 'itemModel' })
  itemId: Types.ObjectId;

  @ApiHideProperty()
  @Prop({ type: String, required: true })
  itemModel: string;

  @ApiProperty({
    type: Types.ObjectId,
    description: 'User ID',
  })
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @ApiProperty({
    type: Number,
    description: 'Quantity',
  })
  @Prop({ type: Number, default: 1 })
  quantity: number;
}

export type CartDocument = HydratedDocument<Cart>;

export const CartSchema = SchemaFactory.createForClass(Cart);
