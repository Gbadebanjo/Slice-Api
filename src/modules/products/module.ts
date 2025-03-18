import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseCollectionNames, DatabaseModelNames } from 'src/shared/enums';
import { StoreSchema } from '../store/schema';
import { ProductSchema } from './schema';
import { ProductQueryService } from './query.service';
import { ProductRepository } from './repository';
import { ProductController } from './controller';
import { StoreModule } from '../store/module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DatabaseCollectionNames.PRODUCT, schema: ProductSchema },
      { name: DatabaseCollectionNames.STORE, schema: StoreSchema },
      {
        name: DatabaseModelNames.PRODUCT,
        schema: ProductSchema,
      },
      {
        name: DatabaseModelNames.STORE,
        schema: StoreSchema,
      },
    ]),
    // StoreModule,
    forwardRef(() => StoreModule),
  ],
  controllers: [ProductController],
  providers: [ProductQueryService, ProductRepository],
  exports: [ProductQueryService, ProductRepository],
})
export class ProductModule {}
