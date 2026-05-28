import { Controller } from '@nestjs/common';
import { ReferralProfitsService } from './referral-profits.service';

@Controller('referral-profits')
export class ReferralProfitsController {
  constructor(private readonly referralProfitsService: ReferralProfitsService) {}
}
