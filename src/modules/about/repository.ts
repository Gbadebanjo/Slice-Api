import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseCollectionNames } from 'src/shared/enums';
import { About } from './schema';
import { Identifier } from 'src/shared/types';

@Injectable()
export class AboutRepository {
  constructor(@InjectModel(DatabaseCollectionNames.ABOUT) private readonly aboutModel: Model<About>) {}

  async find(id: Identifier): Promise<About> {
    return this.aboutModel.findById(id).exec();
  }

  async findAll(): Promise<About[]> {
    return this.aboutModel.find().exec();
  }

  async create(about: Partial<About>): Promise<About> {
    const newAbout = await this.aboutModel.create(about);
    return newAbout.save();
  }

  async update(id: Identifier, about: Partial<About>): Promise<About> {
    return this.aboutModel.findByIdAndUpdate(id, about, { new: true }).exec();
  }
}
