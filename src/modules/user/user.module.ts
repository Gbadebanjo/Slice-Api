import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseCollectionNames } from '../../shared/enums/db.enum';
import { MailerModule } from '../mailer/mailer.module';
import { UserController } from './user.controller';
import { UserQueryService } from './user.query.service';
import { UserRepository } from './user.repository';
import { UserSchema } from './user.schema';
import { ProfileModule } from '../profile/module';

@Module({
  imports: [MongooseModule.forFeature([{ name: DatabaseCollectionNames.USER, schema: UserSchema }]), MailerModule, ProfileModule],
  providers: [UserQueryService, UserRepository],
  exports: [UserQueryService],
  controllers: [UserController],
})
export class UserModule {}
