import { User } from '@monorepo/database';
import { Injectable, NotFoundException } from '@nestjs/common';

import { UserRepository } from '../repositories';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUser(id: number): Promise<User> {
    const user = await this.userRepository.getUser(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
