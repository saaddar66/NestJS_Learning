import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* interface Product {
  id: number;
  userId: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
}

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  private nextId = 1;

  create(createProductDto: CreateProductDto): Product {
    const newProduct: Product = { id: this.nextId++, ...createProductDto };
    this.products.push(newProduct);
    return newProduct;
  }

  findAll(): Product[] {
    return this.products;
  }

  // NOTE: This MUST throw NotFoundException for InvoicesService validation to work.
  findOne(id: number): Product {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto): Product {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    this.products[index] = { ...this.products[index], ...updateProductDto };
    return this.products[index];
  }

  remove(id: number) {
    const initialLength = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    if (this.products.length === initialLength) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    return { message: `Product ${id} successfully removed.` };
  }
}*/

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto) {
    const entity = this.productsRepo.create(dto);
    return this.productsRepo.save(entity);
  }

  findAll() {
    return this.productsRepo.find({ relations: ['user'] });
  }

  async findOne(id: number) {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.productsRepo.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productsRepo.remove(product);
    return { message: `Product ${id} removed` };
  }
}