/* import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import type { StoredInvoice } from './dto/stored-invoices.dto';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto): Promise<StoredInvoice> {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Get()
  findAll(): StoredInvoice[] {
    return this.invoicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): StoredInvoice {
    return this.invoicesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateInvoiceDto: UpdateInvoiceDto): StoredInvoice {
    return this.invoicesService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.invoicesService.remove(id);
  }
} */

import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { StoredInvoice } from './dto/stored-invoices.dto';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  // 1. Helper function to map Entity -> DTO
  // Note: Adjust property names (e.g., invoice.user vs invoice.userId) to match your actual Entity
  private mapToDto(invoice: any): StoredInvoice {
    return {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      status: invoice.status,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
      // Mapping relations: The entity likely has objects, the DTO wants IDs
      userId: invoice.user ? invoice.user.id : invoice.userId, 
      customerId: invoice.customer ? invoice.customer.id : invoice.customerId,
      // Mapping array: The entity likely calls it 'items' or 'invoiceItems'
      lineItems: invoice.items 
        ? invoice.items.map((item) => ({
            productId: item.product ? item.product.id : item.productId,
            quantity: item.quantity,
          })) 
        : [],
      // Calculate total if it's not stored in the DB
      totalAmount: invoice.totalAmount || 0, 
    };
  }

  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto): Promise<StoredInvoice> {
    const invoice = await this.invoicesService.create(createInvoiceDto);
    return this.mapToDto(invoice);
  }

  @Get()
  async findAll(): Promise<StoredInvoice[]> {
    // Service returns Promise<Invoice[]>, we map to Promise<StoredInvoice[]>
    const invoices = await this.invoicesService.findAll();
    return invoices.map((invoice) => this.mapToDto(invoice));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<StoredInvoice> {
    const invoice = await this.invoicesService.findOne(id);
    return this.mapToDto(invoice);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<StoredInvoice> {
    const invoice = await this.invoicesService.update(id, updateInvoiceDto);
    return this.mapToDto(invoice);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.invoicesService.remove(id);
  }
}