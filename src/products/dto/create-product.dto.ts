import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    //* Documentacion
    default: 10,
    description: `Product Title`,
    nullable: false,
    minLength: 1,
  })
  @IsString()
  @MinLength(1, {
    message: 'El titulo debe de tener más de 1 caracter',
  })
  title: string;

  @ApiProperty() //* Documentacion
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty() //* Documentacion
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty() //* Documentacion
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty() //* Documentacion
  @IsNumber()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty() //* Documentacion
  @IsArray()
  @IsString({ each: true }) //* Para validar que cada elemento del array cumpla con la condicion
  sizes: string[];

  @ApiProperty() //* Documentacion
  @IsString()
  @IsIn(['men', 'women', 'kid', 'unisex']) //* Para que solo pueda recibir datos que estan especificados
  gender: string;

  @ApiProperty() //* Documentacion
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string[];

  @ApiProperty() //* Documentacion
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
