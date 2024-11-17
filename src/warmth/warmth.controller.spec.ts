import { Test, TestingModule } from '@nestjs/testing';
import { WarmthController } from './warmth.controller';

describe('WarmthController', () => {
  let controller: WarmthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WarmthController],
    }).compile();

    controller = module.get<WarmthController>(WarmthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
