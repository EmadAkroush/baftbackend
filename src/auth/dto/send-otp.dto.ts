import {
  IsMobilePhone,
  IsNotEmpty,
} from 'class-validator';

export class SendOtpDto {
  @IsNotEmpty({
    message: 'شماره موبایل الزامی است',
  })
  @IsMobilePhone(
    'fa-IR',
    {},
    {
      message:
        'شماره موبایل معتبر نیست',
    },
  )
  phone: string;
}