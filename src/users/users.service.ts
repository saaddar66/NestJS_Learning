import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Note: In a real app, hash the password here before saving
    const user = this.usersRepo.create({
      ...createUserDto,
      role: createUserDto.role as any,
    });
    await this.usersRepo.save(user);
    
    // Remove password before returning
    const { password, ...result } = user;
    return result as unknown as User;
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepo.find({ relations: ['customers', 'invoices', 'products'] });
    // Strip passwords from results
    return users.map((user) => {
      const { password, ...result } = user;
      return result as User;
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepo.findOne({ 
      where: { id },
      relations: ['customers', 'invoices', 'products'] 
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    
    const { password, ...result } = user;
    return result as User;
  }

  // Used by AuthService
  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepo.findOne({ where: { email } });
    return user || undefined;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepo.findOneBy({ id }); // Check existence first
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    // Merge new data into existing entity
    const mergeData: Partial<User> = { ...updateUserDto } as Partial<User>;
    const updatedUser = this.usersRepo.merge(user, mergeData);
    await this.usersRepo.save(updatedUser);

    const { password, ...result } = updatedUser;
    return result as User;
  }

  async remove(id: number) {
    const result = await this.usersRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return { message: `User ${id} successfully removed.` };
  }
}