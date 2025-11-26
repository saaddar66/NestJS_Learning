import { PartialType, InputType } from '@nestjs/graphql';
import { CreateUserDto } from './create-user.dto';

// Makes all fields from CreateUserDto optional for PATCH requests.
@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {}