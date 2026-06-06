import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { OrdersService } from './orders.service';

import { CreateOrderDto } from './dto/create-order.dto';

import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.create(dto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('user/:userId')
  getUserOrders(
    @Param('userId') userId: string,
  ) {
    return this.ordersService.findUserOrders(
      userId,
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.ordersService.update(
      id,
      dto,
    );
  }

  @Patch(':id/status/:status')
  updateStatus(
    @Param('id') id: string,
    @Param('status') status: string,
  ) {
    return this.ordersService.updateStatus(
      id,
      status,
    );
  }

  @Patch(':id/tracking/:trackingCode')
  updateTracking(
    @Param('id') id: string,
    @Param('trackingCode')
    trackingCode: string,
  ) {
    return this.ordersService.updateTrackingCode(
      id,
      trackingCode,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.ordersService.remove(id);
  }
}