import { Resolver, Query, Mutation, Args, Int, ResolveField } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CustomersService } from '../customers/customers.service';
import { InvoicesService } from '../invoices/invoices.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Invoice } from '../invoices/entities/invoice.entity';
import { Customer } from '../customers/entities/customer.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('data') data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @Query(() => [User])
  users() {
    return this.usersService.findAll();
  }

  @Query(() => User)
  user(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateUserDto,
  ) {
    return this.usersService.update(id, data);
  }

  @Mutation(() => Boolean)
  async removeUser(@Args('id', { type: () => Int }) id: number) {
    await this.usersService.remove(id);
    return true;
  }

  // 3. Add ResolveField for Customers
  @ResolveField('customers', () => [Customer])
  async getCustomers(@Parent() user: User) {
    // This only runs if the client queries: { user { customers { ... } } }
    return this.CustomersService.findByUserId(user.id);
  }

  // 4. Add ResolveField for Invoices
  @ResolveField('invoices', () => [Invoice])
  async getInvoices(@Parent() user: User) {
    return this.InvoicesService.findByUserId(user.id);
  }
}
