// src/modules/users/users.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';

import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  // =========================
  // CREATE USER
  // =========================

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(
      createUserDto,
    );
  }

  // =========================
  // GET ALL USERS
  // =========================

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  // =========================
  // GET USER BY ID
  // =========================

  @Get(':id')
  async findById(
    @Param('id') id: string,
  ) {
    return this.usersService.findById(id);
  }

  // =========================
  // UPDATE USER
  // =========================

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(
      id,
      updateUserDto,
    );
  }

  // =========================
  // USER BALANCES
  // =========================

  @Get(':id/balances')
  async getUserBalances(
    @Param('id') id: string,
  ) {
    return this.usersService.getUserBalances(
      id,
    );
  }

  // =========================
  // CHANGE PASSWORD
  // =========================

  @Put(':id/password')
  async updatePassword(
    @Param('id') id: string,

    @Body()
    body: {
      newPassword: string;
      confirmPassword: string;
    },
  ) {
    return this.usersService.updatePassword(
      id,
      body.newPassword,
      body.confirmPassword,
    );
  }

  // =========================
  // DELETE USER
  // =========================

  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
  ) {
    return this.usersService.deleteUser(id);
  }
}