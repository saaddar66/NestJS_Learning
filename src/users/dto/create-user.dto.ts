
import { IsString, IsEmail, MinLength, IsEnum } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { UserRole } from '../entities/user.entity';

// Maps to the 'users' table columns
@InputType()
export class CreateUserDto {
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @Field()
  name!: string;

  @IsEmail()
  @Field()
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Field()
  // Note: In a real app, this should be excluded from output and immediately hashed.
  password!: string;

  @IsEnum(UserRole)
  @Field()
  role!: UserRole;
}
