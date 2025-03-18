import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class LoginReqDto {
  @ApiProperty({ description: 'Email address of the user', example: 'oluwagbogoadebanjo@yahoo.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Password for the user account. Must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one special character.',
    example: 'MySecure@Password!#',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;
}
