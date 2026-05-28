import { Test, TestingModule } from '@nestjs/testing';
import { ReferralProfitsService } from './referral-profits.service';

describe('ReferralProfitsService', () => {
  let service: ReferralProfitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReferralProfitsService],
    }).compile();

    service = module.get<ReferralProfitsService>(ReferralProfitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
