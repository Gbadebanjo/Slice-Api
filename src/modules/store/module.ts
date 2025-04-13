import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseCollectionNames, DatabaseModelNames } from 'src/shared/enums';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { StoreSchema } from './schema';
import { MailerModule } from '../mailer/mailer.module';
import { ProfileModule } from '../profile/module';
import { StoreController } from './controller';
import { StoreQueryService } from './query.service';
import { StoreRepository } from './repository';
import { ProfileSchema } from '../profile/schema';
import { ProductSchema } from '../products/schema';
import { ProductModule } from '../products/module';
import { UserSchema } from '../user/user.schema';
import { AboutSchema } from '../about/schema';
import { AboutModule } from '../about/module';
// import { AboutSchema } from '../about/schema';
// import { AboutModule } from '../about/module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DatabaseCollectionNames.STORE,
        schema: StoreSchema,
      },
      {
        name: DatabaseCollectionNames.PROFILE,
        schema: ProfileSchema,
      },
      {
        name: DatabaseModelNames.PROFILE,
        schema: ProfileSchema,
      },
      {
        name: DatabaseCollectionNames.PRODUCT,
        schema: ProductSchema,
      },
      {
        name: DatabaseModelNames.PRODUCT,
        schema: ProductSchema,
      },
      {
        name: DatabaseModelNames.USER,
        schema: UserSchema,
      },
      {
        name: DatabaseModelNames.ABOUT,
        schema: AboutSchema,
      },
    ]),
    MailerModule,
    ProfileModule,
    ProductModule,
    AboutModule,
    CloudinaryModule,
  ],
  controllers: [StoreController],
  providers: [StoreQueryService, StoreRepository],
  exports: [StoreQueryService, StoreRepository],
})
export class StoreModule {}
