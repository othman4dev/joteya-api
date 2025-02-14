import { IsEmail, IsString, Min, Max, IsNumber } from 'class-validator';

export class VerifyResetDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsNumber()
  @Min(100000)
  @Max(999999)
  code: number;
}
