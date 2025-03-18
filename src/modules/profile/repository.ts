// Purpose: Profile repository for Profile module.
// External dependencies
import { FilterQuery, Model, QueryOptions, Types, UpdateQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

// Internal dependencies
import { Profile, ProfileDocument } from './schema';

// Shared dependencies
import { DatabaseCollectionNames } from '../../shared/enums/db.enum';

@Injectable()
export class ProfileRepository {
  constructor(@InjectModel(DatabaseCollectionNames.PROFILE) private ProfileModel: Model<ProfileDocument>) {}

  async find(filter: FilterQuery<ProfileDocument>): Promise<Profile[]> {
    return this.ProfileModel.find(filter).lean();
  }

  async findById(id: string | Types.ObjectId): Promise<Profile | null> {
    return this.ProfileModel.findById(id).lean();
  }

  async findOne(filter: FilterQuery<ProfileDocument>): Promise<Profile | null> {
    return this.ProfileModel.findOne(filter).lean();
  }

  async create(profile: Profile): Promise<ProfileDocument> {
    return this.ProfileModel.create(profile);
  }

  async findOneAndUpdate(
    filter: FilterQuery<ProfileDocument>,
    update: UpdateQuery<ProfileDocument>,
    options: QueryOptions<ProfileDocument>,
  ): Promise<ProfileDocument | null> {
    return this.ProfileModel.findOneAndUpdate(filter, update, options);
  }

  async findByIdAndUpdate(
    id,
    update: UpdateQuery<ProfileDocument>,
    options: QueryOptions<ProfileDocument>,
  ): Promise<ProfileDocument | null> {
    return this.ProfileModel.findByIdAndUpdate(id, update, options);
  }
}
