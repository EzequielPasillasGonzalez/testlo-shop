import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { normalizar_slug } from '../helpers/slug_normalizacion';
import { ProductImage } from './';
import { User } from 'src/auth/entities/users.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  //* Definicion de las tablas
  @ApiProperty({
    // * Para documentar respuesta con swagger
    example: 'e838bbc8-8a42-43be-ab18-99759b0fe9e1',
    uniqueItems: true,
    description: 'Product Id',
  })
  @PrimaryGeneratedColumn('uuid') //* Clave primaria de tipo uuid
  id_producto: string;

  @ApiProperty({
    // * Para documentar respuesta con swagger
    example: `Women's Small Wordmark Short Sleeve V-Neck Tee`,
    description: 'Product Name',
    uniqueItems: true,
  })
  @Column('text', {
    //* Columna varchar
    unique: true,
  })
  title: string;

  @ApiProperty({
    // * Para documentar respuesta con swagger
    example: 0,
    description: 'Product price',
    default: 0,
  })
  @Column('float', {
    default: 0,
  })
  price: number;

  @ApiProperty({
    // * Para documentar respuesta con swagger
    example: 'In magna tempor aliqua est ipsum enim.',
    description: 'Product description',
    nullable: true,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    // * Para documentar respuesta con swagger
    example: `women_small_wordmark_short_sleeve_v-neck_tee`,
    description: 'Product slug',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  slug: string;

  @ApiProperty({
    // * Para documentar respuesta con swagger
    example: 0,
    description: 'Product stock',
    default: 0,
  })
  @Column('int', {
    default: 0,
  })
  stock: number;

  @ApiProperty({
    // * Para documentar respuesta con swagger
    example: ['XS', 'S', 'M'],
    description: 'Product sizes',
  })
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    // * Para documentar respuesta con swagger
    example: 'men',
    description: 'Product gender',
  })
  @Column('text')
  gender: string;

  // tags
  @ApiProperty({
    // * Para documentar respuesta con swagger
    example: ['sweatshirt'],
    description: 'Product sizes',
  })
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  // images
  @ApiProperty() // * Para documentar respuesta con swagger
  // Relacion entre producto e imagenes
  @OneToMany(
    () => ProductImage, // Regresa la clase de la entidad ProductImage
    (productImage) => productImage.product,
    { cascade: true, eager: true },
    // Cascade: si se elimina un producto tambien lo hace en automatico en la otra tabla
    // Eager: Trae las relaciones de la tabla cuando se hace un find
  )
  images?: ProductImage[];

  // Asi crea una nueva columna
  @ManyToOne(() => User, (user) => user.product, { eager: true }) // Eager =>carga la relacion entre las tablas
  user: User;

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
