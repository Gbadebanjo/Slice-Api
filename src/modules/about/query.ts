import { Injectable } from '@nestjs/common';
import { Identifier } from 'src/shared/types';

import { AboutRepository } from './repository';
import { About } from './schema';

@Injectable()
export class AboutQueryService {
  constructor(private readonly aboutRepository: AboutRepository) {}

  public async getAbout() {
    return this.aboutRepository.findAll();
  }

  public async getAboutById(id: Identifier): Promise<About | null> {
    return this.aboutRepository.find(id);
  }

  public async createAbout(about: Partial<About>): Promise<About> {
    return this.aboutRepository.create(about);
  }

  public async updateAbout(id: Identifier, about: Partial<About>): Promise<About> {
    return this.aboutRepository.update(id, about);
  }
}
