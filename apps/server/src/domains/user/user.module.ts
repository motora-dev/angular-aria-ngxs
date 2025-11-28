import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { PrismaAdapterModule } from '$shared/adapters';
import { GetUserHandler } from './queries';
import { UserRepository } from './repositories';
import { UserService } from './services';
import { UserController } from './user.controller';

const UserHandlers = [GetUserHandler];

@Module({
  imports: [CqrsModule, PrismaAdapterModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, ...UserHandlers],
})
export class UserModule {}
