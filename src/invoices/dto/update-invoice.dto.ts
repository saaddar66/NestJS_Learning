/* import { PartialType, OmitType } from '@nestjs/graphql';
import { CreateInvoiceDto } from './create-invoice.dto';

// 1. Create a version of the DTO that strictlty removes the sensitive fields
class InvoiceUpdateBase extends OmitType(CreateInvoiceDto, [
  'lineItems', 
  'userId', 
  'customerId'
] as const) {}

// 2. Make the remaining fields (status, invoiceNumber) optional
export class UpdateInvoiceDto extends PartialType(InvoiceUpdateBase) {}
*/
import { InputType, PartialType, OmitType } from '@nestjs/graphql';
import { CreateInvoiceDto } from './create-invoice.dto';

@InputType()
export class UpdateInvoiceDto extends PartialType(
  OmitType(CreateInvoiceDto, ['lineItems', 'userId', 'customerId'] as const),
) {}