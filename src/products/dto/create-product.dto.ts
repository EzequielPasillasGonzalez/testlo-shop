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
  @IsString()
  @MinLength(1, {
    message: 'El titulo debe de tener más de 1 caracter',
  })
  title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @IsArray()
  @IsString({ each: true }) //* Para validar que cada elemento del array cumpla con la condicion
  sizes: string[];

  @IsString()
  @IsIn(['men', 'women', 'kid', 'unisex']) //* Para que solo pueda recibir datos que estan especificados

  gender: string;
}
