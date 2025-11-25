import { IsString, IsNumber, Min, IsOptional } from 'class-validator';
import { IsInt } from 'class-validator';
import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateProductDto {
  // Required: Foreign Key relationship to the user who created the product
  @IsInt()
  @Field(() => Int)
  userId!: number; 

  @IsString()
  @Field()
  name!: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  description?: string;

  @IsNumber()
  @Min(0.01)
  @Field(() => Float)
  // Ensure the price is treated as a number
  price!: number; 

  @IsInt()
  @Min(0)
  @Field(() => Int)
  stockQuantity!: number;
}