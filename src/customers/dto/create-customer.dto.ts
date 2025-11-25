import { IsString, IsEmail, IsOptional, Matches } from 'class-validator';
import { IsInt } from 'class-validator'; // Assuming user_id is passed as an integer
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateCustomerDto {
  // Required: Foreign Key relationship to the user who created the customer
  @IsInt()
  @Field(() => Int)
  userId!: number; 

  @IsString()
  @Field()
  name!: string;

  @IsEmail()
  @Field()
  email!: string;

  @IsString()
  // Pattern to match common 10 or 11 digit phone numbers (e.g., US/PK format)
  @Matches(/^\d{11}$/, { message: 'Phone number must be 10 or 11 digits' })
  @Field()
  phoneNo!: string;

  @IsString()
  @Field()
  address!: string;
}