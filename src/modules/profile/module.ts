import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProfileQueryService } from './query.service';
import { ProfileRepository } from './repository';
import { ProfileSchema } from './schema';
import { DatabaseCollectionNames, DatabaseModelNames } from '../../shared/enums';
import { UserSchema } from '../user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DatabaseCollectionNames.PROFILE,
        schema: ProfileSchema,
      },
      {
        name: DatabaseModelNames.PROFILE,
        schema: ProfileSchema,
      },
      {
        name: DatabaseCollectionNames.USER,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [ProfileQueryService, ProfileRepository],
  exports: [ProfileQueryService, ProfileRepository],
})
export class ProfileModule {}
