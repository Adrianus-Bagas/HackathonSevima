import { Test, TestingModule } from '@nestjs/testing';
import { StopsController } from './stops.controller';
import { StopsService } from './stops.service';

describe('StopsController', () => {
  let controller: StopsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StopsController],
      providers: [StopsService],
    }).compile();

    controller = module.get<StopsController>(StopsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
