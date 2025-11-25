//export class User {}
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Customer } from '../../customers/entities/customer.entity';
import { Product } from '../../products/entities/products.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';

// 1. Define the Roles Enum
export enum UserRole {
  ADMIN = 'admin',
  LIBRARIAN = 'librarian', // Or 'manager' for invoicing context
  MEMBER = 'member',
}

// Register enum with GraphQL
registerEnumType(UserRole, {
  name: 'UserRole',
});

@Entity('users')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  @Field(() => Int)
  id!: number;

  @Column()
  // Exclude password from GraphQL schema for security
  password!: string;

  // 3. Add Role with a default
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  @Field(() => UserRole)
  role: UserRole = UserRole.MEMBER;
  
  @Column({ length: 100 })
  @Field()
  name!: string;

  @Column({ length: 40, unique: true })
  @Field()
  email!: string;

  // --- INVERSE RELATIONS START HERE ---
  
  // A user has many customers
  @OneToMany(() => Customer, (customer) => customer.user)
  @Field(() => [Customer], { nullable: true })
  customers?: Customer[];

  // A user has many products
  @OneToMany(() => Product, (product) => product.user)
  @Field(() => [Product], { nullable: true })
  products?: Product[];

  // A user has many invoices
  @OneToMany(() => Invoice, (invoice) => invoice.user)
  @Field(() => [Invoice], { nullable: true })
  invoices?: Invoice[];
}