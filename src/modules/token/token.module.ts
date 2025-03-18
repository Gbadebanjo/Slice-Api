import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseCollectionNames } from '../../shared/enums/db.enum';
import { TokenQueryService } from './token.query-service';
import { TokenRepository } from './token.repository';
import { TokenSchema } from './token.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: DatabaseCollectionNames.TOKEN, schema: TokenSchema }])],
  providers: [TokenQueryService, TokenRepository],
  exports: [TokenQueryService],
})
export class TokenModule {}
