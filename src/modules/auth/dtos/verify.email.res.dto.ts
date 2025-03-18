import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailRes {
  @ApiProperty({
    example: 'Email verified successfully',
  })
  message: string;

  @ApiProperty({
    example: true,
  })
  success: boolean;
}
