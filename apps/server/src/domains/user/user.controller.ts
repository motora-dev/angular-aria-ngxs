import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { GetUserResponse } from './dto';
import { GetUserQuery } from './queries';

@Controller('user')
export class UserController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<GetUserResponse> {
    return await this.queryBus.execute(new GetUserQuery(id));
  }
}
