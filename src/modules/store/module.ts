import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseCollectionNames } from 'src/shared/enums';
import { StoreSchema } from './schema';
import { MailerModule } from '../mailer/mailer.module';
import { ProfileModule } from '../profile/module';
import { StoreController } from './controller';
import { StoreQueryService } from './query.service';
import { StoreRepository } from './repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DatabaseCollectionNames.STORE,
        schema: StoreSchema,
      },
    ]),
    MailerModule,
    ProfileModule,
  ],
  controllers: [StoreController],
  providers: [StoreQueryService, StoreRepository],
  exports: [StoreQueryService],
})
export class StoreModule {}
