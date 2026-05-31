import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
} from '@nestjs/common';

import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
  ) {}

  // =====================================
  // ADMIN
  // =====================================

  @Get()
  async getAllTransactions() {
    return this.transactionsService.getAllTransactionsForAdmin();
  }

  // =====================================
  // USER TRANSACTIONS
  // =====================================

  @Get('user/:userId')
  async getUserTransactions(
    @Param('userId') userId: string,
  ) {
    return this.transactionsService.getUserTransactions(
      userId,
    );
  }

  @Get(':id')
  async getTransactionById(
    @Param('id') id: string,
  ) {
    return this.transactionsService.getTransactionById(
      id,
    );
  }

  // =====================================
  // CREATE TRANSACTION
  // =====================================

  @Post()
  async createTransaction(
    @Body() body: any,
  ) {
    return this.transactionsService.createTransaction(
      body,
    );
  }

  // =====================================
  // PRODUCT PURCHASE
  // =====================================

  @Post('purchase')
  async createPurchase(
    @Body()
    body: {
      userId: string;
      amount: number;
      orderId: string;
    },
  ) {
    return this.transactionsService.createPurchaseTransaction(
      body.userId,
      body.amount,
      body.orderId,
    );
  }

  // =====================================
  // REFERRAL BONUS
  // =====================================

  @Post('referral-bonus')
  async createReferralBonus(
    @Body()
    body: {
      userId: string;
      amount: number;
      relatedUserId?: string;
    },
  ) {
    return this.transactionsService.createReferralBonus(
      body.userId,
      body.amount,
      body.relatedUserId,
    );
  }

  // =====================================
  // PAIR BONUS
  // =====================================

  @Post('pair-bonus')
  async createPairBonus(
    @Body()
    body: {
      userId: string;
      amount: number;
      leftVolume: number;
      rightVolume: number;
      pairCycle: number;
    },
  ) {
    return this.transactionsService.createPairBonus(
      body.userId,
      body.amount,
      body.leftVolume,
      body.rightVolume,
      body.pairCycle,
    );
  }

  // =====================================
  // RANK BONUS
  // =====================================

  @Post('rank-bonus')
  async createRankBonus(
    @Body()
    body: {
      userId: string;
      amount: number;
    },
  ) {
    return this.transactionsService.createRankBonus(
      body.userId,
      body.amount,
    );
  }

  // =====================================
  // MANUAL BONUS
  // =====================================

  @Post('manual-bonus')
  async createManualBonus(
    @Body()
    body: {
      userId: string;
      amount: number;
      note?: string;
    },
  ) {
    return this.transactionsService.createManualBonus(
      body.userId,
      body.amount,
      body.note,
    );
  }

  // =====================================
  // WITHDRAWAL
  // =====================================

  @Post('withdraw')
  async requestWithdrawal(
    @Body()
    body: {
      userId: string;
      amount: number;
    },
  ) {
    return this.transactionsService.requestWithdrawal(
      body.userId,
      body.amount,
    );
  }

  // =====================================
  // APPROVE WITHDRAW
  // =====================================

  @Patch(':id/approve')
  async approveWithdrawal(
    @Param('id') transactionId: string,

    @Body()
    body: {
      adminId: string;
    },
  ) {
    return this.transactionsService.approveWithdrawal(
      transactionId,
      body.adminId,
    );
  }

  // =====================================
  // REJECT WITHDRAW
  // =====================================

  @Patch(':id/reject')
  async rejectWithdrawal(
    @Param('id') transactionId: string,

    @Body()
    body: {
      adminId: string;
    },
  ) {
    return this.transactionsService.rejectWithdrawal(
      transactionId,
      body.adminId,
    );
  }

  // =====================================
  // USER FINANCIAL SUMMARY
  // =====================================

  @Get('summary/:userId')
  async getUserFinancialSummary(
    @Param('userId') userId: string,
  ) {
    return this.transactionsService.getUserFinancialSummary(
      userId,
    );
  }

  // =====================================
  // CHARTS
  // =====================================

  @Get('charts/bonus')
  async getBonusChart() {
    return this.transactionsService.getBonusChart();
  }

  @Get('charts/withdraw')
  async getWithdrawChart() {
    return this.transactionsService.getWithdrawalChart();
  }
}