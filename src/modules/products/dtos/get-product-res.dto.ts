import { ApiProperty } from '@nestjs/swagger';
// import { Profile } from 'src/modules/profile/schema';
// import { Identifier } from 'src/shared/types';

export class GetProductResDto {
  @ApiProperty({
    description: 'Response Status',
    example: 'true',
  })
  success: boolean;

  @ApiProperty({
    description: 'Response Message',
    example: 'Products Found',
  })
  message: string;

  //   @ApiProperty({
  //     description: 'Store',
  //     example: {
  //       _id: '643405452324db8c464c0584',
  //       profile: '643405452324db8c464c0584',
  //       categories: ['Electronics', 'Books'],
  //       storelogo: 'https://example.com/logo.png',
  //       about: '643405452324db8c464c0585',
  //       reviews: '6434057493823093',
  //     },
  //   })
  //   store: {
  //     _id?: Identifier;
  //     profile?: Profile;
  //     categories?: string[];
  //     storelogo?: string;
  //     about?: Identifier;
  //     reviews?: Identifier;
  //   };
}
