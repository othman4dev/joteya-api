import { IsEmail, IsString } from 'class-validator';

export class ResetDto {
  @IsString()
  @IsEmail()
  email: string;
}
