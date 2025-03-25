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
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { handleResponse } from 'src/common/helpers/';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/users.entity';

//@Auth() //? Se protege toda la ruta
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(ValidRoles.admin)
  async create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ) {
    const response = await this.productsService.create(createProductDto, user);
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
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id') // Tarea
  @Auth(ValidRoles.superUser)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    const response = this.productsService.remove(id);
    return handleResponse(response, 'Se ha eliminado el producto');
  }
}
