import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { ProductImage } from './entities';
import { handleExceptions } from 'src/common/helpers/handleExecepcions.helpers';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product) // Se inserta el reposito, que seria el modelo
    private readonly productoRepository: Repository<Product>,

    @InjectRepository(ProductImage) // Se inserta el reposito, que seria el modelo
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;

      //* Crea la instancia del producto con las propiedades
      const producto = this.productoRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });

      //* Se guarda en base de datos
      await this.productoRepository.save(producto);

      return { ...producto, images: images };
    } catch (error) {
      // Loguea el error
      if (error instanceof Error) {
        this.logger.error(`${error.name}: ${error.message}`, error.stack);
      } else {
        this.logger.error('Unexpected error', error);
      }

      handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;

      const products: Product[] = await this.productoRepository.find({
        take: limit,
        skip: offset,
        //Todo: Relaciones
        relations: {
          images: true,
        },
      });

      if (products.length === 0) {
        throw new NotFoundException('No hay productos registrados');
      }
      return products.map((product) => ({
        ...product,
        images: product.images?.map((img) => img.url), // Solo mandar el url
      }));
    } catch (error) {
      // Loguea el error
      if (error instanceof Error) {
        this.logger.error(`${error.name}: ${error.message}`, error.stack);
      } else {
        this.logger.error('Unexpected error', error);
      }

      handleExceptions(error);
    }
  }

  async findOne(termino: string) {
    try {
      let producto;

      if (isUUID(termino)) {
        producto = await this.productoRepository.findOneBy({
          id_producto: termino,
        });
      }

      if (!producto) {
        // Se construye un query
        const queryBuilder =
          // producto alias para hacer la consulta en el leftJoin
          this.productoRepository.createQueryBuilder('producto');

        producto = await queryBuilder
          .where(`UPPER(title) = :title or slug = :slug`, {
            title: termino.toUpperCase().trim(),
            slug: termino.toLowerCase().trim(),
          })
          // Trae la tabla con la relacion
          // producto.images columna de la tabla con el alias
          // prodImages alias del campo a traer
          .leftJoinAndSelect('producto.images', 'prodImages')
          .getOne(); // Solo trae uno
      }

      if (!producto) {
        throw new NotFoundException(
          `No hay productos registrados con el termino ${termino}`,
        );
      }

      return producto;
    } catch (error) {
      // Loguea el error
      if (error instanceof Error) {
        this.logger.error(`${error.name}: ${error.message}`, error.stack);
      } else {
        this.logger.error('Unexpected error', error);
      }

      handleExceptions(error);
    }
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);

    return {
      ...rest,
      images: images.map((image) => image.url),
    };
  }

  async update(id_producto: string, updateProductDto: UpdateProductDto) {
    // Create query runner - Para actualizar las iamges
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      const { images, ...toUpdate } = updateProductDto;

      // Busca un producto por el id
      // Pre-Carga todas las propiedades que llegan por el updateProductDto
      const producto = await this.productoRepository.preload({
        id_producto,
        ...toUpdate,
      });

      if (!producto) {
        throw new NotFoundException(
          `No hay productos registrados con el termino ${id_producto}`,
        );
      }

      await queryRunner.connect();
      await queryRunner.startTransaction();

      if (images) {
        // Elimina las imagenes anteriores
        await queryRunner.manager.delete(ProductImage, {
          product: { id_producto }, // Nombre la columna en ProductImage : id de la tabla de producto
        });

        // Preapara las imagenes para despues guardar
        producto.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }

      await queryRunner.manager.save(producto);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain(id_producto);
    } catch (error) {
      await queryRunner.rollbackTransaction(); // Para deshacer las transacciones si sucede un error
      await queryRunner.release();

      // Loguea el error
      if (error instanceof Error) {
        this.logger.error(`${error.name}: ${error.message}`, error.stack);
      } else {
        this.logger.error('Unexpected error', error);
      }

      handleExceptions(error);
    }
  }

  async remove(termino: string) {
    try {
      const product: Product = await this.findOne(termino);

      await this.productoRepository.remove(product);

      return;
    } catch (error) {
      // Loguea el error
      if (error instanceof Error) {
        this.logger.error(`${error.name}: ${error.message}`, error.stack);
      } else {
        this.logger.error('Unexpected error', error);
      }

      handleExceptions(error);
    }
  }

  async deleAllProducts() {
    const query = this.productoRepository.createQueryBuilder('product');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      handleExceptions(error);
    }
  }
}
