import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordResDto {
  @ApiProperty({
    description: 'Message to the user',
    example: 'Password changed successfully',
  })
  message: string;
}
