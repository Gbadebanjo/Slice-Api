import { ApiProperty } from '@nestjs/swagger';

export class ResendEmailCodeRes {
  @ApiProperty({
    example: 'Email code sent successfully',
  })
  message: string;

  @ApiProperty({
    example: true,
  })
  success: boolean;
}
