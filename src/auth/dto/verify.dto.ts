import { IsNumber, Min, Max, IsString, IsEmail } from 'class-validator';

export class VerifyDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsNumber()
  @Min(1000)
  @Max(9999)
  code: number;
}
