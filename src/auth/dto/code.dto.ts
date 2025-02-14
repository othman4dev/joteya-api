import { IsEmail, IsNotEmpty } from 'class-validator';

export class CodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
