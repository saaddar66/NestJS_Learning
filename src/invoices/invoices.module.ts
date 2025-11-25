import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { InvoiceResolver } from './invoices.resolver';

// Import modules whose services we need to inject into InvoicesService
import { CustomersModule } from '../customers/customers.module';
import { ProductsModule } from '../products/products.module';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  // Modules listed here are imported so that their exported providers 
  // (CustomersService, ProductsService) can be used within InvoicesModule.
  imports: [
    CustomersModule, 
    ProductsModule,
    TypeOrmModule.forFeature([Invoice, InvoiceItem])
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoiceResolver]
  //exports: [InvoicesService],
})
export class InvoicesModule {}