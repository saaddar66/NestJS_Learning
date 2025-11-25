import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customersService: CustomersService) {}

  @Mutation(() => Customer)
  createCustomer(@Args('data') data: CreateCustomerDto) {
    return this.customersService.create(data);
  }

  @Query(() => [Customer])
  customers() {
    return this.customersService.findAll();
  }

  @Query(() => Customer)
  customer(@Args('id', { type: () => Int }) id: number) {
    return this.customersService.findOne(id);
  }

  @Mutation(() => Customer)
  updateCustomer(@Args('id', { type: () => Int }) id: number, @Args('data') data: UpdateCustomerDto) {
    return this.customersService.update(id, data);
  }

  @Mutation(() => Boolean)
  async removeCustomer(@Args('id', { type: () => Int }) id: number) {
    await this.customersService.remove(id);
    return true;
  }
}
