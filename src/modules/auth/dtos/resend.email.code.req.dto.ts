import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendEmailCodeReqDto {
  @ApiProperty({
    example: 'Email address of the user',
    description: 'Email address of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password of the user',
    description: 'Password of the user',
  })
  @IsNotEmpty()
  password: string;
}
