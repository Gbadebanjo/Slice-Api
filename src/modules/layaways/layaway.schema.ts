import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Layaway {
  @ApiProperty({
    description: 'The unique identifier of the layaway',
    example: '643405452324db8c464c0584',
  })
  @Prop({
    required: true,
    default: () => new Types.ObjectId(),
  })
  _id?: Types.ObjectId;

  // @ApiProperty({
  //   description: 'The name of the layaway',
  //   example: 'Layaway Name',
  // })
  // @Prop({
  //   required: true,
  // })
  // name: string;

  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '643405452324db8c464c0583',
  })
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
  })
  userId: Types.ObjectId;

  @ApiProperty({
    description: 'The unique identifier of the item',
    example: '643405452324db8c464c0585',
  })
  @Prop({
    required: true,
    type: Types.ObjectId,
    refPath: 'itemModel',
  })
  itemId: Types.ObjectId;

  @ApiHideProperty()
  @Prop({
    required: true,
  })
  itemModel: string;

  @ApiProperty({
    description: 'Transaction Id of the inital payment',
    example: '643405452324db8c464c0586',
  })
  @Prop({
    type: Types.ObjectId,
  })
  initialPaymentTransactionId: Types.ObjectId;

  @ApiProperty({
    description: 'The initial payment made for the layaway',
    example: 100.0,
  })
  @Prop({
    required: true,
    type: Number,
  })
  initialPayment: number;

  @ApiProperty({
    description: 'The weekly payment amount for the layaway',
    example: 50.0,
  })
  @Prop({
    required: true,
    type: Number,
  })
  weeklyPayment: number;

  @ApiProperty({
    description: 'The remaining amount to be paid for the layaway',
    example: 200.0,
  })
  @Prop({
    required: true,
    type: Number,
  })
  amountRemain: number;

  @ApiProperty({
    description: 'The number of installments for the layaway',
    example: 4,
  })
  @Prop({
    required: true,
    type: Number,
  })
  noOfInstallments: number;

  @ApiProperty({
    description: 'The installment type (e.g., weekly, monthly)',
    example: 'weekly',
  })
  @Prop({
    required: true,
    type: String,
  })
  installmentType: string;

  @ApiProperty({
    description: 'The layaway payment details',
    example: [
      {
        amount: 50.0,
        status: 'Paid',
        dateCreated: '2023-01-01T00:00:00.000Z',
        datePaid: '2023-01-08T00:00:00.000Z',
        transactionId: '643405452324db8c464c0587',
      },
    ],
  })
  @Prop({
    required: true,
    type: [
      {
        amount: { type: Number, required: true },
        status: { type: String, required: true },
        dateCreated: { type: Date, required: true, default: Date.now },
        datePaid: { type: Date, default: null },
        transactionId: { type: Types.ObjectId, ref: 'Transaction' },
      },
    ],
  })
  layaways: {
    amount: number;
    status: string;
    dateCreated: Date;
    datePaid?: Date;
  }[];
}

export type LayawayDocument = HydratedDocument<Layaway>;

export const LayawaySchema = SchemaFactory.createForClass(Layaway);
LayawaySchema.index({ userId: 1, itemId: 1 }, { unique: true });
