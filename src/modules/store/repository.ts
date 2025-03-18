import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Identifier } from 'src/shared/types';
import { DatabaseCollectionNames } from '../../shared/enums';
import { Store, StoreDocument } from './schema';
import { StoreDto } from './dtos/store.dto';

@Injectable()
export class StoreRepository {
  constructor(@InjectModel(DatabaseCollectionNames.STORE) private StoreModel: Model<StoreDocument>) {}

  async create(store: Partial<Store>): Promise<StoreDocument> {
    return this.StoreModel.create(store);
  }

  async findAll(): Promise<StoreDocument[]> {
    return this.StoreModel.find().exec();
  }

  async findById(id: Identifier): Promise<StoreDocument> {
    return this.StoreModel.findById(id).exec();
  }

  async findOne(filter: FilterQuery<StoreDocument>): Promise<StoreDto> {
    return this.StoreModel.findOne(filter).populate('profile').exec();
  }

  async update(id: Identifier, store: Partial<StoreDocument>): Promise<StoreDocument> {
    return this.StoreModel.findByIdAndUpdate(id, store, { new: true }).exec();
  }

  async delete(id: Identifier): Promise<StoreDocument> {
    return this.StoreModel.findByIdAndDelete(id).exec();
  }
}
