import { ApiProperty } from '@nestjs/swagger';

export class AboutReqDto {
  @ApiProperty({
    description: 'The about lists of object of header and content',
    example: [{ header: 'header', content: 'content' }],
  })
  abouts: { header: string; content: string }[];
}
