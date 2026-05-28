

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  // Use a flexible type for in-memory users to avoid strict-assignment errors
  private users: any[] = [];

  create(createUserDto: CreateUserDto) {
    const user = {
      id: crypto.randomUUID(),


      createdAt: new Date(),

      updatedAt: new Date(),

      ...createUserDto,
    };

    this.users.push(user);

    return {
      message: 'User created successfully',
      data: user,
    };
  }

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    const user = this.users.find(
      (user) => user.id === id,
    );

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    return user;
  }

  update(
    id: string,
    updateUserDto: UpdateUserDto,
  ) {
    const user = this.findOne(id);

    Object.assign(user, updateUserDto);

    user.updatedAt = new Date();

    return {
      message: 'User updated successfully',
      data: user,
    };
  }

  remove(id: string) {
    const userIndex = this.users.findIndex(
      (user) => user.id === id,
    );

    if (userIndex === -1) {
      throw new NotFoundException(
        'User not found',
      );
    }

    this.users.splice(userIndex, 1);

    return {
      message: 'User deleted successfully',
    };
  }
}