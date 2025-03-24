import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage, Product } from './entities/';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]), // Se declara el tipo de ORM, con el product entity
  ],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
