import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { InvoiceLineItemDto } from './invoice-line-item.dto';

@ObjectType()
export class StoredInvoice {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  userId!: number;

  @Field(() => Int)
  customerId!: number;

  @Field()
  invoiceNumber!: string;

  @Field()
  status!: string;

  @Field(() => [InvoiceLineItemDto])
  lineItems!: InvoiceLineItemDto[];

  @Field(() => Float)
  totalAmount!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
