import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
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
  constructor(
    private readonly usersService: UsersService,
    // INJECT MISSING SERVICES HERE
    private readonly customersService: CustomersService,
    private readonly invoicesService: InvoicesService,
  ) {}

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

  // --- FIELD RESOLVERS ---

  @ResolveField('customers', () => [Customer])
  async getCustomers(@Parent() user: User) { // Fixed @Parent()
    // Use the injected instance (lowercase c), not the class
    return this.customersService.findByUserId(user.id);
  }

  @ResolveField('invoices', () => [Invoice])
  async getInvoices(@Parent() user: User) { // Fixed @Parent()
    // Use the injected instance (lowercase i), not the class
    return this.invoicesService.findByUserId(user.id);
  }
}