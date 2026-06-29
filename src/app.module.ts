import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';

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
import { ReferralsModule } from './referrals/referrals.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    // خواندن فایل .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // MongoDB
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/baft',
    ),

    AuthModule,
    UsersModule,
    ReferralProfitsModule,
    ProductsModule,
    TicketsModule,
    AdminModule,
    TransactionsModule,
    BonusesModule,
    ReferralsModule,
    OrdersModule,
    CategoriesModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
