import { ApiProperty } from '@nestjs/swagger';
import { Identifier } from '../../../shared/types';

export class ProfileResDto {
  @ApiProperty({
    description: 'Response Status',
    example: 'true',
  })
  success: boolean;

  @ApiProperty({
    description: 'Response Message',
    example: 'Profile created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Profile',
    example: {
      _id: '643405452324db8c464c0584',
      user: '643405452324db8c464c0584',
      storeName: 'My Store',
      storeDescription: 'A great store for all your needs',
      phoneNumber: '+1234567890',
    },
  })
  profile: {
    _id?: Identifier;
    user?: Identifier;
    storeName?: string;
    storeDescription?: string;
    phoneNumber?: string;
  };
}
