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
import { Response } from 'src/Interfaces/Response.Interface';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('products')
export class ProductsController {
  private response: Response

  constructor(private readonly productsService: ProductsService) { }

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const response = await this.productsService.create(createProductDto)
    return this.handleResponse(response, 'Se ha creado el registro');
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto ) {  
    const response = await this.productsService.findAll(paginationDto)
    return this.handleResponse(response, 'Productos encontrados')
  }

  @Get(':termino')
  async findOne(@Param('termino', new ParseUUIDPipe()) termino: string) {
    const response = await this.productsService.findOne(termino)
    return this.handleResponse(response, 'Se ha encontrado el producto');

  }

  @Patch(':termino')
  update(@Param('termino') termino: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(termino, updateProductDto);
  }

  @Delete(':termino') // Tarea
  remove(@Param('termino', ParseUUIDPipe) termino: string) {
    const response = this.productsService.remove(termino)
    return this.handleResponse(response, 'Se ha eliminado el producto');
    
  }

  private handleResponse(data: any, message: string) {
    return this.response = {
      ok: true,
      body: {
        message,
        data
      }
    }
  }
}
