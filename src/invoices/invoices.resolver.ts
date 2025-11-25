import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { InvoicesService } from './invoices.service';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Resolver(() => Invoice)
export class InvoiceResolver {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Mutation(() => Invoice)
  createInvoice(
    @Args('data') data: CreateInvoiceDto,
  ) {
    return this.invoicesService.create(data);
  }

  @Query(() => [Invoice], { name: 'invoices' })
  findAll() {
    return this.invoicesService.findAll();
  }

  @Query(() => Invoice, { name: 'invoice' })
  findOne(
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.invoicesService.findOne(id);
  }

  @Mutation(() => Invoice)
  updateInvoice(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateInvoiceDto,
  ) {
    return this.invoicesService.update(id, data);
  }

  @Mutation(() => Boolean)
  async deleteInvoice(
    @Args('id', { type: () => Int }) id: number,
  ) {
    await this.invoicesService.remove(id);
    return true;
  }
}
