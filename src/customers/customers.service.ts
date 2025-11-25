import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepo: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Map the DTO's userId to the relation object
    const { userId, ...customerData } = createCustomerDto;
    
    const newCustomer = this.customersRepo.create({
      ...customerData,
      user: { id: userId }, // TypeORM maps this to the user_id column
    });
    
    return this.customersRepo.save(newCustomer);
  }

  findAll(): Promise<Customer[]> {
    return this.customersRepo.find({ relations: ['user', 'invoices'] });
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customersRepo.findOne({ 
      where: { id },
      relations: ['user', 'invoices']
    });
    
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found.`);
    }
    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id); // Ensures it exists
    
    // Handle potential userId update mapping
    const { userId, ...data } = updateCustomerDto;
    const updateData: any = { ...data };
    if (userId) {
      updateData.user = { id: userId };
    }

    this.customersRepo.merge(customer, updateData);
    return this.customersRepo.save(customer);
  }

  async remove(id: number) {
    const result = await this.customersRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Customer with ID ${id} not found.`);
    }
    return { message: `Customer ${id} successfully removed.` };
  }

  // Add this method to CustomersService
async findByUserId(userId: number): Promise<Customer[]> {
  return this.customersRepo.find({ 
    where: { user: { id: userId } } 
  });
}
}