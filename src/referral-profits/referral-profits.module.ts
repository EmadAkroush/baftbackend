import { Module } from '@nestjs/common';
import { ReferralProfitsService } from './referral-profits.service';
import { ReferralProfitsController } from './referral-profits.controller';

@Module({
  controllers: [ReferralProfitsController],
  providers: [ReferralProfitsService],
})
export class ReferralProfitsModule {}
