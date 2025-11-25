import { IsNumber, IsArray, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer'; // Needed for nested validation
import { InputType, Field, Int } from '@nestjs/graphql';
import { InvoiceLineItemDto } from './invoice-line-item.dto';

@InputType()
export class CreateInvoiceDto {
  // Required: Foreign Key relationship to the user who created the invoice
  @IsNumber()
  @Field(() => Int)
  userId!: number;

  // Required: Foreign Key relationship to the customer being billed
  @IsNumber()
  @Field(() => Int)
  customerId!: number;

  @IsString()
  @Field()
  // Assuming a unique, readable invoice number (e.g., INV-2025-0001)
  invoiceNumber!: string;

  @IsString()
  @Field()
  // Example: 'Draft', 'Sent', 'Paid', 'Cancelled'
  status!: string;

  // Nested validation for the array of line items
  @IsArray()
  @ValidateNested({ each: true }) // Validate every item in the array
  @Type(() => InvoiceLineItemDto) // Tells class-transformer what type is in the array
  @Field(() => [InvoiceLineItemDto])
  lineItems!: InvoiceLineItemDto[];

  // Note: 'amount' and 'created_at' are calculated by the database/service and not passed in the DTO.
}
