import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseCollectionNames, DatabaseModelNames } from 'src/shared/enums';
import { CartController } from './controller';
import { CartQueryService } from './query.service';
import { CartSchema } from './cart.schema';
import { CartRepository } from './repository';
import { ProductModule } from '../products/module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DatabaseCollectionNames.CART,
        schema: CartSchema,
      },
      {
        name: DatabaseModelNames.CART,
        schema: CartSchema,
      },
    ]),
    ProductModule,
  ],
  controllers: [CartController],
  providers: [CartQueryService, CartRepository],
  exports: [CartQueryService],
})
export class CartModule {}
