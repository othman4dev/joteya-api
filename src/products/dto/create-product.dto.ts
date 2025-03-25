import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  Max,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(100)
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(10000)
  price: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(9999)
  discount: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10000)
  quantity: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  status: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  authenticity: string;

  @IsNotEmpty()
  @IsString()
  condition: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  sex: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  size: string;

  @IsOptional()
  @IsString()
  about: string;

  @IsNotEmpty()
  productImages: string[];
}
