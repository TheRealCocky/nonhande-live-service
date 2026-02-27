import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class SignalDto {
  @IsString()
  @IsNotEmpty()
  toRoom: string;

  @IsObject()
  @IsOptional()
  offer?: any;

  @IsObject()
  @IsOptional()
  answer?: any;

  @IsObject()
  @IsOptional()
  candidate?: any;
}