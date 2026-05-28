import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ReferralProfitsModule } from './referral-profits/referral-profits.module';
import { ProductsModule } from './products/products.module';
import { TicketsModule } from './tickets/tickets.module';
import { AdminModule } from './admin/admin.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BonusesModule } from './bonuses/bonuses.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [AuthModule, UsersModule,  MongooseModule.forRoot('mongodb://localhost:27017/vesta'), ReferralProfitsModule, ProductsModule, TicketsModule, AdminModule, TransactionsModule, BonusesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
