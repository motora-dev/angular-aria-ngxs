import { QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: QueryBus,
          useValue: {
            execute: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUser', () => {
    it('should call queryBus.execute with GetUserQuery', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(queryBus.execute).mockResolvedValue(mockUser);

      const result = await controller.getUser(1);

      expect(queryBus.execute).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });
});
