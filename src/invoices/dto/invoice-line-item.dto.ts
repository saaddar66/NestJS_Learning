import { IsNumber, Min } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class InvoiceLineItemDto {
  @IsNumber()
  @Min(1, { message: 'Product ID must be a positive integer' })
  @Field(() => Int)
  productId!: number; // Foreign Key to the Product resource

  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  @Field(() => Int)
  quantity!: number;
}