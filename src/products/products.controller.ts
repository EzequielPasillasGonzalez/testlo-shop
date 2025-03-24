import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'src/common/Interfaces/Response.Interface';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { handleResponse } from 'src/common/helpers/handleResponse.helper';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const response = await this.productsService.create(createProductDto);
    return handleResponse(response, 'Se ha creado el registro');
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const response = await this.productsService.findAll(paginationDto);
    return handleResponse(response, 'Productos encontrados');
  }

  @Get(':termino')
  async findOne(@Param('termino') termino: string) {
    const response = await this.productsService.findOnePlain(termino);
    return handleResponse(response, 'Se ha encontrado el producto');
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id') // Tarea
  remove(@Param('id', ParseUUIDPipe) id: string) {
    const response = this.productsService.remove(id);
    return handleResponse(response, 'Se ha eliminado el producto');
  }
}
