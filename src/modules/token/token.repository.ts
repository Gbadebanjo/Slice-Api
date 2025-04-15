import { FilterQuery, Model, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Identifier } from 'src/shared/types';

import { DatabaseCollectionNames } from '../../shared/enums/db.enum';
import { Token, TokenDocument } from './token.schema';

@Injectable()
export class TokenRepository {
  constructor(@InjectModel(DatabaseCollectionNames.TOKEN) private TokenModel: Model<TokenDocument>) {}

  async find(filter: FilterQuery<TokenDocument>, selectOptions?: ProjectionType<TokenDocument>): Promise<Token[]> {
    return this.TokenModel.find(filter, selectOptions).lean();
  }

  async findOne(filter: FilterQuery<TokenDocument>): Promise<Token> {
    return this.TokenModel.findOne(filter).lean();
  }

  async create(token: Token): Promise<Token> {
    return this.TokenModel.create(token);
  }

  async findById(TokenId: string): Promise<Token> {
    return this.TokenModel.findById(TokenId).lean();
  }

  async findOneAndUpdate(
    filter: FilterQuery<TokenDocument>,
    update: UpdateQuery<Token>,
    options?: QueryOptions<Token>,
  ): Promise<TokenDocument> {
    return this.TokenModel.findOneAndUpdate(filter, update, options).lean();
  }

  async findByIdAndDelete(tokenId: Identifier): Promise<Token> {
    return this.TokenModel.findByIdAndDelete(tokenId).lean();
  }
}
