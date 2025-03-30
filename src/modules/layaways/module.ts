import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseCollectionNames, DatabaseModelNames } from 'src/shared/enums';
import { LayawaySchema } from './layaway.schema';
import { LayawayController } from './controller';
import { LayawayQueryService } from './query.service';
import { LayawayRepository } from './repository';
import { ProductModule } from '../products/module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DatabaseCollectionNames.LAYAWAY,
        schema: LayawaySchema,
      },
      {
        name: DatabaseModelNames.LAYAWAY,
        schema: LayawaySchema,
      },
    ]),
    ProductModule,
  ],
  controllers: [LayawayController],
  providers: [LayawayQueryService, LayawayRepository],
  exports: [LayawayQueryService, LayawayRepository],
})
export class LayawayModule {}
