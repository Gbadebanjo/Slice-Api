import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { LayawayRepository } from './repository';
import { Layaway } from './layaway.schema';
import { BadRequestException } from '../../exceptions';
import { LayawayReqDto } from './dtos/layaway.req.dto';
import { Identifier } from '../../shared/types';
import { ProductQueryService } from '../products/query.service';

@Injectable()
export class LayawayQueryService {
  constructor(
    private readonly layawayRepository: LayawayRepository,
    private readonly productService: ProductQueryService,
  ) {}

  async ItemModel(model: string, itemId: Identifier): Promise<any> {
    switch (model) {
      case 'Product':
        return this.productService.getProductById(itemId);
      default:
        return null;
    }
  }

  async createLayaway(layaway: LayawayReqDto & { userId: Identifier }): Promise<Layaway> {
    try {
      const { userId, initialPayment, noOfInstallments, weeklyPayment, amountRemaining, itemId, installmentType, itemType } = layaway;

      const item = await this.ItemModel(itemType, itemId);

      if (!item) {
        throw BadRequestException.RESOURCE_NOT_FOUND('Item not found');
      }

      if (item.status !== 'active') {
        throw BadRequestException.UNEXPECTED('Item is not available for layaway');
      }

      const checkLayAway = await this.layawayRepository.findBy({ userId: new Types.ObjectId(userId), itemId: new Types.ObjectId(itemId) });

      if (checkLayAway) {
        throw BadRequestException.RESOURCE_ALREADY_EXISTS('Layaway already exists for this item');
      }

      const itemPriceCheck = item.price === amountRemaining + initialPayment;
      if (!itemPriceCheck) {
        throw BadRequestException.UNEXPECTED('Item price does not match layaway amount');
      }

      const totalInstallMentPayment = weeklyPayment * noOfInstallments + initialPayment;
      if (totalInstallMentPayment !== item.price) {
        throw BadRequestException.UNEXPECTED('Total payment does not match item price');
      }

      const layaways = [];

      const initialPaymentData = {
        amount: initialPayment,
        dateCreated: new Date(),
        status: 'Pending',
        datePaid: null,
        transactionId: null,
      };

      layaways.push(initialPaymentData);

      for (let i = 0; i < noOfInstallments; i += 1) {
        const layawayData = {
          amount: weeklyPayment,
          dateCreated: new Date(),
          status: 'Pending',
          datePaid: null,
          transactionId: null,
        };

        layaways.push(layawayData);
      }

      const layawayDoc = await this.layawayRepository.createLayaway({
        userId: new Types.ObjectId(userId),
        itemId: new Types.ObjectId(itemId),
        initialPayment,
        amountRemain: amountRemaining,
        noOfInstallments,
        installmentType,
        layaways,
        itemModel: itemType,
        weeklyPayment,
      });
      return layawayDoc;
    } catch (error) {
      console.log(typeof error, error);
      throw BadRequestException.UNEXPECTED(`An error occurred please try again: ${error.message}`);
    }
  }

  async getAllLayAways(): Promise<Layaway[]> {
    try {
      return await this.layawayRepository.findAll();
    } catch (error) {
      throw BadRequestException.UNEXPECTED(`An error occurred please try again: ${error}`);
    }
  }

  async getALayawayBy(layawayFilter: Partial<Layaway>): Promise<Layaway> {
    try {
      return await this.layawayRepository.findBy(layawayFilter);
    } catch (error) {
      throw BadRequestException.UNEXPECTED(`An error occurred please try again: ${error}`);
    }
  }

  async getLayawayById(id: string): Promise<Layaway> {
    return this.layawayRepository.findById(id);
  }
}
