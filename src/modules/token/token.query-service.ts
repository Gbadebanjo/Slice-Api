import { Injectable } from '@nestjs/common';
import { Identifier } from 'src/shared/types';
import { InternalServerErrorException } from '../../exceptions/internal-server-error.exception';

import { Token } from './token.schema';
import { TokenRepository } from './token.repository';

@Injectable()
export class TokenQueryService {
  constructor(private readonly tokenRepository: TokenRepository) {}

  async create(token: Token): Promise<Token> {
    try {
      return await this.tokenRepository.create(token);
    } catch (error) {
      throw InternalServerErrorException.INTERNAL_SERVER_ERROR(error);
    }
  }

  async findToken(token: Token): Promise<Token> {
    try {
      return await this.tokenRepository.findOne({
        userId: token.userId,
        type: token.type,
        value: token.value,
        expiresIn: { $gt: new Date() },
        userType: token.userType,
      });
    } catch (error) {
      throw InternalServerErrorException.INTERNAL_SERVER_ERROR(error);
    }
  }

  async updateToken(token: Token): Promise<Token> {
    try {
      return await this.tokenRepository.findOneAndUpdate(token._id, { value: token.value, expiresIn: token.expiresIn }, { new: true });
    } catch (error) {
      throw InternalServerErrorException.INTERNAL_SERVER_ERROR(error);
    }
  }

  async findAToken(tokenIfo: Partial<Token>): Promise<Token> {
    try {
      return await this.tokenRepository.findOne({
        userId: tokenIfo.userId,
        type: tokenIfo.type,
        userType: tokenIfo.userType,
      });
    } catch (error) {
      throw InternalServerErrorException.INTERNAL_SERVER_ERROR(error);
    }
  }

  async findById(tokenId: string): Promise<Token> {
    try {
      return await this.tokenRepository.findById(tokenId);
    } catch (error) {
      throw InternalServerErrorException.INTERNAL_SERVER_ERROR(error);
    }
  }

  async deleteToken(tokenId: Identifier): Promise<Token> {
    try {
      return await this.tokenRepository.findByIdAndDelete(tokenId);
    } catch (error) {
      throw InternalServerErrorException.INTERNAL_SERVER_ERROR(error);
    }
  }
}
