import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ObjectId, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Response } from 'src/Interfaces/Response.Interface';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product) // Se inserta el reposito, que seria el modelo
    private readonly productoRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {
      //* Crea la instancia del producto con las propiedades
      const producto = this.productoRepository.create(createProductDto);

      //* Se guarda en base de datos
      await this.productoRepository.save(producto);

      return producto
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto

      const products: Product[] = await this.productoRepository.find({
        take: limit,
        skip: offset
        //Todo: Relaciones
      })

      if (products.length === 0) {
        throw new BadRequestException('No hay productos registrados');
      }
      return products
    } catch (error) {
      return this.handleExceptions(error)
    }
  }

  async findOne(termino: string) {

    try {
      let producto


      producto = await this.productoRepository.findOneBy({
        id: termino
      })


      if (!producto) {
        throw new BadRequestException(`No hay productos registrados con el termino ${termino}`);
      }




      return producto

    } catch (error) {
      return this.handleExceptions(error)

    }
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(termino: string) {
    try {

      const product: Product = await this.findOne(termino)

      await this.productoRepository.remove(product);

      return
    } catch (error) {
      return this.handleExceptions(error)

    }



  }

  private handleExceptions(error: any) {
    // Loguea mejor el error
    if (error instanceof Error) {
      this.logger.error(`${error.name}: ${error.message}`, error.stack);
    } else {
      this.logger.error('Unexpected error', error);
    }

    // Si ya es una BadRequestException, la relanza
    if (error instanceof BadRequestException) {
      throw error;
    }

    // Manejo especial para errores de base de datos (PostgreSQL, Sequelize, etc.)
    if (error?.code === '23505') {
      throw new BadRequestException(error.detail || 'Registro duplicado');
    }

    // Manejo de errores desconocidos como strings
    if (typeof error === 'string') {
      throw new BadRequestException(error);
    }

    // Si no se reconoce el error, se maneja como un error de servidor
    throw new InternalServerErrorException(
      `Unexpected server error, check server logs`,
    );
  }



}
