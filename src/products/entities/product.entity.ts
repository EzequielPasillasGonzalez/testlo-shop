import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { normalizar_slug } from '../helpers/slug_normalizacion';
import { ProductImage } from './';

@Entity({ name: 'products' })
export class Product {
  //* Definicion de las tablas
  @PrimaryGeneratedColumn('uuid') //* Clave primaria de tipo uuid
  id_producto: string;

  @Column('text', {
    //* Columna varchar
    unique: true,
  })
  title: string;

  @Column('float', {
    default: 0,
  })
  price: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column('text', {
    unique: true,
  })
  slug: string;

  @Column('int', {
    default: 0,
  })
  stock: number;

  @Column('text', {
    array: true,
  })
  sizes: string[];

  @Column('text')
  gender: string;

  // tags
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  // images
  // Relacion entre producto e imagenes
  @OneToMany(
    () => ProductImage, // Regresa la clase de la entidad ProductImage
    (productImage) => productImage.product,
    { cascade: true, eager: true },
    // Cascade: si se elimina un producto tambien lo hace en automatico en la otra tabla
    // Eager: Trae las relaciones de la tabla cuando se hace un find
  )
  images?: ProductImage[];

  @BeforeInsert() // Antes de insertar realiza este codigo
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = normalizar_slug(this.slug);
  }

  @BeforeUpdate()
  CheckSlugUpdate() {
    this.slug = normalizar_slug(this.slug);
  }
}
