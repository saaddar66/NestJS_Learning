import { PartialType } from '@nestjs/graphql';
import { CreateUserDto } from './create-user.dto';

// Makes all fields from CreateUserDto optional for PATCH requests.
export class UpdateUserDto extends PartialType(CreateUserDto) {}