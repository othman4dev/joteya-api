import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateCartDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}
