import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseCollectionNames } from 'src/shared/enums';
import { AboutSchema } from './schema';
import { AboutQueryService } from './query';
import { AboutRepository } from './repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DatabaseCollectionNames.ABOUT,
        schema: AboutSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [AboutQueryService, AboutRepository],
  exports: [AboutQueryService],
})
export class AboutModule {}
