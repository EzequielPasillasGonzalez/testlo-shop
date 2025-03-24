import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '.';

@Entity({ name: 'product_images' })
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  // Se crea una relacion con otra tabla
  @ManyToOne(() => Product, (producto) => producto.images, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column('text')
  url: string;
}
