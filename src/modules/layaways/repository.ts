import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseCollectionNames } from 'src/shared/enums';
import { Layaway, LayawayDocument } from './layaway.schema';

@Injectable()
export class LayawayRepository {
  constructor(@InjectModel(DatabaseCollectionNames.LAYAWAY) private layawayModel: Model<LayawayDocument>) {}

  async createLayaway(layaway: Partial<LayawayDocument>): Promise<Layaway> {
    return this.layawayModel.create(layaway);
  }

  async findAll(): Promise<Layaway[]> {
    return this.layawayModel.find().lean();
  }

  async findBy(searchParams: Partial<Layaway>): Promise<Layaway> {
    return this.layawayModel.findOne(searchParams).lean();
  }

  async findByOneAnUpate(id: string, update: Partial<Layaway>): Promise<Layaway> {
    return this.layawayModel.findOneAndUpdate({ _id: id }, update, { new: true }).lean();
  }

  async findById(id: string): Promise<Layaway> {
    return this.layawayModel.findById(id).lean();
  }

  async deleteById(id: string): Promise<Layaway> {
    return this.layawayModel.findByIdAndDelete(id).lean();
  }
}
