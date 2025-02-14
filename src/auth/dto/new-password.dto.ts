import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
} from 'class-validator';

export class NewPasswordDto {
  @IsString()
  email: string;

  @IsString()
  @MinLength(8, {
    message: 'Password is too short. It should be at least 8 characters long.',
  })
  @MaxLength(20, {
    message: 'Password is too long. It should be at most 20 characters long.',
  })
  @Matches(/^(?=.*\d)(?=.*[a-zA-Z]).{8,20}$/, {
    message: 'Password is too weak. It should contain numbers and letters.',
  })
  newPassword: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(100000)
  @Max(999999)
  code: number;
}
