import {
  IsMobilePhone,
  IsNotEmpty,
} from 'class-validator';

export class RefreshTokenDto {
  refreshToken: string;
}