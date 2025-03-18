import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfileReqDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the store',
    example: 'My Store',
    required: true,
  })
  storeName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The description of the store',
    example: 'A great store for all your needs',
    required: true,
  })
  storeDescription: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The phone number of the store',
    example: '+1234567890',
    required: true,
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The address of the store',
    example: '123 Main St',
    required: true,
  })
  address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The city where the store is located',
    example: 'New York',
    required: true,
  })
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The state where the store is located',
    example: 'NY',
    required: true,
  })
  state: string;
}
