//export class ProductEntity {}
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { InvoiceItem } from '../../invoices/entities/invoice-item.entity';

@Entity('products')
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn({ name: 'product_id' })
  @Field(() => Int)
  id!: number;

  // RELATION: Belongs to User
  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Field(() => User, { nullable: true })
  user?: User;

  @Column({ length: 50 })
  @Field()
  name!: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  description?: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  @Field(() => Float)
  price!: number;

  @Column({ name: 'stock_quantity', type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  stockQuantity?: number;
  
  // RELATION: A product can be in many different invoice items (lines on an invoice)
  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.product)
  @Field(() => [InvoiceItem], { nullable: true })
  invoiceItems?: InvoiceItem[];
}