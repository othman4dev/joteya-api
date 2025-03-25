import { IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  quantity: number;

  @IsOptional()
  @IsString()
  status: ProductStatus;

  @IsOptional()
  authenticity: string;

  @IsOptional()
  condition: string;

  @IsOptional()
  category: string;

  @IsOptional()
  brand: string;

  @IsOptional()
  sellerId: string;

  @IsOptional()
  stock: number;

  @IsOptional()
  rating: number;

  @IsOptional()
  productImages: string[];
}

enum ProductStatus {
  AVAILABLE = 'available',
  INAVAILABLE = 'inavailable',
  PENDING = 'pending',
}
