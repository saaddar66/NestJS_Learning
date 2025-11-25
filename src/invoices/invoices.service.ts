import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { CustomersService } from '../customers/customers.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoicesRepo: Repository<Invoice>,
    private readonly customersService: CustomersService,
    private readonly productsService: ProductsService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    // 1. Validate Customer
    const customer = await this.customersService.findOne(createInvoiceDto.customerId);

    let totalAmount = 0;
    const invoiceItems: InvoiceItem[] = [];

    // 2. Process Line Items (Stock Check & Calculation)
    for (const item of createInvoiceDto.lineItems) {
      const product = await this.productsService.findOne(item.productId);

      if (product.stockQuantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for Product ID ${item.productId}. Available: ${product.stockQuantity}`,
        );
      }

      const unitPrice = Number(product.price);
      const subtotal = unitPrice * item.quantity;
      totalAmount += subtotal;

      // Prepare InvoiceItem entity
      const invoiceItem = new InvoiceItem();
      invoiceItem.product = product;
      invoiceItem.quantity = item.quantity;
      invoiceItem.unitPrice = unitPrice;
      invoiceItem.total = subtotal; // If you want to store line totals

      invoiceItems.push(invoiceItem);

      // Decrease stock
      // Note: In production, wrap this whole method in a Transaction to ensure consistency
      await this.productsService.update(product.id, { 
        stockQuantity: product.stockQuantity - item.quantity 
      });
    }

    // 3. Create & Save Invoice (Cascade saves items)
    const newInvoice = this.invoicesRepo.create({
      invoiceNumber: createInvoiceDto.invoiceNumber,
      status: createInvoiceDto.status,
      user: { id: createInvoiceDto.userId },
      customer: customer,
      amount: totalAmount,
      items: invoiceItems, // TypeORM handles saving these relationships
    });

    return this.invoicesRepo.save(newInvoice);
  }

  findAll(): Promise<Invoice[]> {
    return this.invoicesRepo.find({
      relations: ['customer', 'user', 'items', 'items.product'],
    });
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoicesRepo.findOne({
      where: { id },
      relations: ['customer', 'user', 'items', 'items.product'],
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found.`);
    }
    return invoice;
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);
    this.invoicesRepo.merge(invoice, updateInvoiceDto);
    return this.invoicesRepo.save(invoice);
  }

  async remove(id: number) {
    const result = await this.invoicesRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Invoice with ID ${id} not found.`);
    }
    return { message: `Invoice ${id} successfully removed.` };
  }

  // Add this method to InvoicesService
async findByUserId(userId: number): Promise<Invoice[]> {
  return this.invoicesRepo.find({ 
    where: { user: { id: userId } } 
  });
}
}