import { Test, TestingModule } from '@nestjs/testing';
import { ReferralProfitsController } from './referral-profits.controller';
import { ReferralProfitsService } from './referral-profits.service';

describe('ReferralProfitsController', () => {
  let controller: ReferralProfitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferralProfitsController],
      providers: [ReferralProfitsService],
    }).compile();

    controller = module.get<ReferralProfitsController>(ReferralProfitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
