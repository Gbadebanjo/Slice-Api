import { ApiProperty } from '@nestjs/swagger';

export class LayawayReqDto {
  @ApiProperty({
    description: 'The initial payment amount',
    example: 100.0,
  })
  initialPayment: number;

  @ApiProperty({
    description: 'The weekly payment amount',
    example: 25.0,
  })
  weeklyPayment: number;

  @ApiProperty({
    description: 'The remaining amount to be paid',
    example: 300.0,
  })
  amountRemaining: number;

  @ApiProperty({
    description: 'The number of installments',
    example: 12,
  })
  noOfInstallments: number;

  @ApiProperty({
    description: 'The ID of the item being purchased',
    example: '1234567890abcdef12345678',
  })
  itemId: string;

  @ApiProperty({
    description: 'Installment type',
    example: 'weekly',
  })
  installmentType: string;

  @ApiProperty({
    description: 'The type of item being purchased',
    example: 'Product',
  })
  itemType: string;
}
