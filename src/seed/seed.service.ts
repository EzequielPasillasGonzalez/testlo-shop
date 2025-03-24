import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { Product } from 'src/products/entities';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async runSeed() {
    await this.insertNewProducts();
    return 'Seed executed';
  }

  private async insertNewProducts() {
    await this.productsService.deleAllProducts();

    const products = initialData.products.map((producto) => {
      return this.productsService.create({
        ...producto,
        images: producto.images ?? [],
      });
    });

    await Promise.all(products);

    return true;
  }
}
