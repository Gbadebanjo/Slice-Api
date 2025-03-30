import { ApiProperty } from '@nestjs/swagger';

export class LayawayResDto {
  @ApiProperty({
    description: 'Response message',
    example: 'Layaway created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Response status',
    example: true,
  })
  success: boolean;
}
