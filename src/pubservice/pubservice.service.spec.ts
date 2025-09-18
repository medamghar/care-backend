import { Test, TestingModule } from '@nestjs/testing';
import { PubserviceService } from './pubservice.service';

describe('PubserviceService', () => {
  let service: PubserviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PubserviceService],
    }).compile();

    service = module.get<PubserviceService>(PubserviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
