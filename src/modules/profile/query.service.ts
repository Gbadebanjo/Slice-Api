import { Injectable } from '@nestjs/common';
import { ProfileRepository } from './repository';
import { Profile, ProfileDocument } from './schema';
import { InternalServerErrorException } from '../../exceptions/internal-server-error.exception';
import { Identifier } from '../../shared/types';
import { UpdateProfileReqDto } from './dtos/update.profile.dto';
import { BadRequestException } from '../../exceptions';

@Injectable()
export class ProfileQueryService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    // private readonly
  ) {}

  public async createProfile(userId: Identifier, profile: UpdateProfileReqDto): Promise<ProfileDocument> {
    const newProfile = { ...profile, user: userId };
    return this.profileRepository.create(newProfile as any);
  }

  public async updateProfileByUserId(id: Identifier, profile: UpdateProfileReqDto): Promise<Profile> {
    try {
      const userProfile = await this.profileRepository.findOne({ user: id });
      if (!userProfile) {
        throw new Error('Profile not found');
      }
      return await this.profileRepository.findByIdAndUpdate(userProfile._id, profile, { new: true });
    } catch (error) {
      throw InternalServerErrorException.INTERNAL_SERVER_ERROR(error);
    }
  }

  public async getProfile(id: Identifier): Promise<Profile> {
    const userProfile = await this.profileRepository.findOne({ user: id });

    return userProfile;
  }

  public async getProfileByUserId(id: Identifier): Promise<Profile> {
    const userProfile = await this.profileRepository.findOne({ user: id });
    // console.log(userProfile);
    if (!userProfile) {
      throw BadRequestException.RESOURCE_NOT_FOUND('Profile not found');
    }
    return userProfile;
  }
}
