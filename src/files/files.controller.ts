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
  Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { fileFilter, fileNamer, handleResponse } from 'src/common/helpers/';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files') // Tag para documentacion
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('/product/:imageName')
  findProductImage(
    @Res() res: Response, // Para emitir respesta manualmente
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);

    res.sendFile(path);
    // return handleResponse(true, path, 'Se encontro el documento');
  }

  @Post('product')
  @UseInterceptors(
    //# Nombre del archivo que recibimos desde el body
    FileInterceptor('file', {
      fileFilter: fileFilter,
      // limits: { fileSize: 1000},
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }),
    }),
  )
  uploadProductFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Asegurate de mandar una imagen');
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${
      file.filename
    }`;

    return handleResponse(true, secureUrl, 'Imagen cargada');
  }
}
