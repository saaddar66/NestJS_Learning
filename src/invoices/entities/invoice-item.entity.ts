import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Invoice } from './invoice.entity';
import { Product } from '../../products/entities/products.entity';

@Entity('invoice_items')
@ObjectType()
export class InvoiceItem {
  @PrimaryGeneratedColumn({ name: 'invoice_item_id' })
  @Field(() => Int)
  id!: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoice_id' })
  @Field(() => Invoice, { nullable: true })
  invoice?: Invoice;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  @Field(() => Product, { nullable: true })
  product?: Product;

  @Column('int')
  @Field(() => Int)
  quantity!: number;

  @Column('decimal', { name: 'unit_price', precision: 10, scale: 2 })
  @Field(() => Float)
  unitPrice!: number;

  // Although your DB generates this, it is often easier to calculate in JS before save
  // to ensure the parent Invoice total is accurate immediately.
  @Column('decimal', { precision: 12, scale: 2 })
  @Field(() => Float)
  total!: number; 
}