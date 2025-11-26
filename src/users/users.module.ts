import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserResolver } from './users.resolver';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from '../customers/customers.module'; // Import this
import { InvoicesModule } from '../invoices/invoices.module';   // Import this

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  CustomersModule, // Add here
  InvoicesModule, ], 
 controllers: [UsersController],
  providers: [UsersService, UserResolver],
  // EXPORT: Makes UsersService available for cross-module use.
  exports: [UsersService], 
})
export class UsersModule {}