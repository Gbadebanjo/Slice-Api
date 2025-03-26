import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordReqDto {
  @ApiProperty({
    description: 'The current password of the user',
    example: 'password123',
  })
  currentPassword: string;

  @ApiProperty({
    description: 'The new password of the user',
    example: 'password456',
  })
  newPassword: string;
}
