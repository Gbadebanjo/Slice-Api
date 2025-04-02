import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateCartReqDto {
  @ApiProperty({
    type: String,
    description: 'Item ID',
  })
  itemId: string;

  @ApiHideProperty()
  userId: string;

  @ApiProperty({
    type: String,
    description: 'Item Type',
  })
  itemType: string;

  @ApiProperty({
    type: Number,
    description: 'Quantity',
    default: 1,
  })
  quantity?: number;
}
