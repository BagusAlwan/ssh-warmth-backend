import { Test, TestingModule } from '@nestjs/testing';
import { WarmthService } from './warmth.service';

describe('WarmthService', () => {
  let service: WarmthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WarmthService],
    }).compile();

    service = module.get<WarmthService>(WarmthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
