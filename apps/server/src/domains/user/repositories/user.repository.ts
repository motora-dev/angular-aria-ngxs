import { User } from '@monorepo/database';
import { Injectable } from '@nestjs/common';

import { PrismaAdapter } from '$shared/adapters';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaAdapter) {}

  async getUser(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id } });
  }
}
