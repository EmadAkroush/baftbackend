import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReferralProfitsService } from './referral-profits.service';
import { Referral, ReferralSchema } from '../referrals/schemas/referrals.schema';
import { Order, OrderSchema } from '../orders/schemas/order.schema';
import { User, UserSchema } from '../users/schemas/user.schema'; // ✅ اضافه کن
import { UsersModule } from '../users/users.module';
import { TransactionsModule } from '../transactions/transactions.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Referral.name, schema: ReferralSchema },
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema }, // ✅ این خط رو اضافه کن

    ]),

    UsersModule,
    TransactionsModule,
  
  ],
  providers: [ReferralProfitsService],
  exports: [ReferralProfitsService], // ✅ خیلی مهم
})
export class ReferralProfitsModule {}
