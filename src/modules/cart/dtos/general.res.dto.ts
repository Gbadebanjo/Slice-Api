import { ApiProperty } from '@nestjs/swagger';

export class GeneralCartResDto {
  @ApiProperty({
    type: Boolean,
    description: 'Request Success Status',
  })
  success: boolean;

  @ApiProperty({
    type: String,
    description: 'Request Response Message',
  })
  message: string;

  //   @ApiProperty({
  //     type: String,
  //     description: 'Cart ID',
  //   })
  //   id: string;

  //   @ApiProperty({
  //     type: String,
  //     description: 'Item ID',
  //   })
  //   itemId: string;

  //   @ApiProperty({
  //     type: String,
  //     description: 'User ID',
  //   })
  //   userId: string;

  //   @ApiProperty({
  //     type: Number,
  //     description: 'Quantity',
  //     default: 1,
  //   })
  //   quantity?: number;
}
