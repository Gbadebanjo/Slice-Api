import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProfileQueryService } from './query.service';
import { ProfileRepository } from './repository';
import { ProfileSchema } from './schema';
import { DatabaseCollectionNames } from '../../shared/enums';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DatabaseCollectionNames.PROFILE,
        schema: ProfileSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [ProfileQueryService, ProfileRepository],
  exports: [ProfileQueryService],
})
export class ProfileModule {}
