import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { InvoiceItem } from './invoice-item.entity';

//export class InvoiceEntity {}
@Entity('invoice')
@ObjectType()
export class Invoice {
  @PrimaryGeneratedColumn({ name: 'invoice_id' })
  @Field(() => Int)
  id!: number;

  // RELATION: An invoice belongs to one User
  @ManyToOne(() => User, (user) => user.invoices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // Matches your schema column name
  @Field(() => User, { nullable: true })
  user?: User;

  // RELATION: An invoice belongs to one Customer
  @ManyToOne(() => Customer, (customer) => customer.invoices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  @Field(() => Customer, { nullable: true })
  customer?: Customer;

  @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true })
  @Field(() => [InvoiceItem], { nullable: true })
  items?: InvoiceItem[];

  @Column({ name: 'invoice_number', unique: true })
  @Field()
  invoiceNumber!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  @Field(() => Float, { nullable: true })
  amount?: number;

  @Column({ length: 20 })
  @Field()
  status!: string; // e.g., 'PAID', 'PENDING'

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  createdAt!: Date;
}