//export class CustomerEntity {}
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';

@Entity('customers')
@ObjectType()
export class Customer {
  @PrimaryGeneratedColumn({ name: 'customer_id' })
  @Field(() => Int)
  id!: number;

  // RELATION: Belongs to User
  @ManyToOne(() => User, (user) => user.customers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // Matches your DB schema column
  @Field(() => User, { nullable: true })
  user?: User;

  @Column({ length: 150 })
  @Field()
  name!: string;

  @Column({ length: 255 })
  @Field()
  email!: string;

  @Column('text')
  @Field()
  address!: string;

  @Column({ name: 'phone_no', length: 11, unique: true })
  @Field()
  phoneNo!: string;

  // --- INVERSE RELATION ---
  // A Customer has many invoices
  @OneToMany(() => Invoice, (invoice) => invoice.customer)
  @Field(() => [Invoice], { nullable: true })
  invoices?: Invoice[];
}