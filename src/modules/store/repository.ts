import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Identifier } from 'src/shared/types';
import { DatabaseCollectionNames } from '../../shared/enums';
import { Store, StoreDocument } from './schema';
import { StoreDto } from './dtos/store.dto';

@Injectable()
export class StoreRepository {
  constructor(
    @InjectModel(DatabaseCollectionNames.STORE) private StoreModel: Model<StoreDocument>,
    // @InjectModel(DatabaseCollectionNames.PROFILE) private ProfileModel: Model<ProfileDocument>,
  ) {}

  async create(store: Partial<Store>): Promise<StoreDocument> {
    return this.StoreModel.create(store);
  }

  async find(filter: FilterQuery<StoreDocument>): Promise<StoreDocument[]> {
    return this.StoreModel.find(filter).populate('profile').populate('about').exec();
  }

  async findAll(): Promise<StoreDocument[]> {
    return this.StoreModel.find().exec();
  }

  async findAllForView(): Promise<StoreDocument[]> {
    return this.StoreModel.find()
      .populate({
        path: 'profile',
        populate: {
          path: 'user',
          select: 'name email',
        },
      })
      .populate('about')
      .exec();
  }

  async findById(id: Identifier): Promise<StoreDocument> {
    return this.StoreModel.findById(id).exec();
  }

  async findOne(filter: FilterQuery<StoreDocument>): Promise<StoreDto> {
    return this.StoreModel.findOne(filter).populate('profile').populate('about').exec();
  }

  async update(id: Identifier, store: Partial<StoreDocument>): Promise<StoreDocument> {
    return this.StoreModel.findByIdAndUpdate(id, store, { new: true }).exec();
  }

  async delete(id: Identifier): Promise<StoreDocument> {
    return this.StoreModel.findByIdAndDelete(id).exec();
  }
}
