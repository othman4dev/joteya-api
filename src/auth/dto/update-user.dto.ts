import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  @MinLength(10)
  @MaxLength(15)
  phone: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  @MaxLength(150)
  bio: string;

  @IsOptional()
  @MaxLength(50)
  location: string;
}
