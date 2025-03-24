import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from 'src/common/helpers/fileFilter.helper';
import { handleResponse } from 'src/common/helpers/handleResponse.helper';
import { diskStorage } from 'multer';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(
    //# Nombre del archivo que recibimos desde el body
    FileInterceptor('file', {
      fileFilter: fileFilter,
      // limits: { fileSize: 1000},
      storage: diskStorage({
        destination: './static/products',
      }),
    }),
  )
  uploadProductFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Asegurate de mandar una imagen');
    }

    return handleResponse(file.originalname, 'Imagen cargada');
  }
}
