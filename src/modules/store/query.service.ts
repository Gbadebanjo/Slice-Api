import { Injectable } from '@nestjs/common';
import { Identifier } from 'src/shared/types';
import { StoreRepository } from './repository';
import { Store } from './schema';
import { BadRequestException } from '../../exceptions';
import { StoreDto } from './dtos/store.dto';
import { ProfileRepository } from '../profile/repository';

@Injectable()
export class StoreQueryService {
  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly profileRepository: ProfileRepository,
  ) {}

  public async createStore(store: Partial<Store>): Promise<Store> {
    const findStore = await this.storeRepository.findOne({ profile: store.profile });
    if (findStore) {
      throw BadRequestException.RESOURCE_ALREADY_EXISTS('Store already created for this profile');
    }
    return this.storeRepository.create(store);
  }

  public async getStores(): Promise<Store[]> {
    return this.storeRepository.findAll();
  }

  public async getStoresForView(): Promise<Store[]> {
    return this.storeRepository.findAllForView();
  }

  public async getStoresByCategory(category: string[]): Promise<Store[]> {
    return this.storeRepository.find({ categories: { $in: category } });
  }

  public async getStoreByProfileId(profileId: Identifier): Promise<StoreDto> {
    return this.storeRepository.findOne({ profile: profileId });
  }

  public async updateStore(profileId: Identifier, store: Partial<Store>): Promise<Store> {
    const findStore = await this.storeRepository.findOne({ profile: profileId });
    if (!findStore) {
      throw BadRequestException.RESOURCE_NOT_FOUND('Store not found for this profile');
    }
    return this.storeRepository.update(findStore._id, store);
  }

  public async getStore(userId: Identifier): Promise<StoreDto> {
    const userProfile = await this.profileRepository.findOne({ user: userId });
    if (!userProfile) {
      throw BadRequestException.RESOURCE_NOT_FOUND('Profile not found');
    }

    const store = await this.storeRepository.findOne({ profile: userProfile._id });
    return store;
  }
}
