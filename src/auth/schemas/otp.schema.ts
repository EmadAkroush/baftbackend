import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

@Schema({
  timestamps: true,
})
export class Otp {
  @Prop({
    required: true,
  })
  phone: string;

  @Prop({
    required: true,
  })
  code: string;

  @Prop({
    required: true,
  })
  expiresAt: Date;
}

export const OtpSchema =
  SchemaFactory.createForClass(Otp);