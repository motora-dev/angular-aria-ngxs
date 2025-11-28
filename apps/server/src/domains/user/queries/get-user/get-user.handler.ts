import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetUserQuery } from './get-user.query';
import { GetUserResponse } from '../../dto';
import { UserService } from '../../services';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly userService: UserService) {}

  async execute(query: GetUserQuery): Promise<GetUserResponse> {
    const user = await this.userService.getUser(query.userId);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
