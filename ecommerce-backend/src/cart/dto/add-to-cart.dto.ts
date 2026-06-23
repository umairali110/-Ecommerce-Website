import { IsNumber, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  productId!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity!: number;
}