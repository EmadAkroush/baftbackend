import {
  IsMobilePhone,
  IsNotEmpty,
  Length,
  Matches,
} from 'class-validator';

export class VerifyOtpDto {
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

  @IsNotEmpty({
    message: 'کد تایید الزامی است',
  })
  @Length(6, 6, {
    message:
      'کد تایید باید ۶ رقم باشد',
  })
  @Matches(/^\d+$/, {
    message:
      'کد تایید فقط باید شامل عدد باشد',
  })
  code: string;
}