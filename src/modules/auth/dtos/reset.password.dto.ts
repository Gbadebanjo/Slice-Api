import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordReqDto {
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

  //   @ApiProperty({
  //     example: 'Token sent to the user',
  //     description: 'Token sent to the user',
  //   })
  //   @IsNotEmpty()
  //   token: string;
}
