import { BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";

export const handleExceptions = (error: any): never => {
  

  throw error;
  // // Si ya es una BadRequestException, la relanza
  // if (error instanceof NotFoundException) {
  // }

  // // Manejo especial para errores de base de datos (PostgreSQL, Sequelize, etc.)
  // if (error?.code === '23505') {
  //   throw new BadRequestException(error.detail || 'Registro duplicado');
  // }

  // // Manejo de errores desconocidos como strings
  // if (typeof error === 'string') {
  //   throw new BadRequestException(error);
  // }

  // // Si no se reconoce el error, se maneja como un error de servidor
  // throw new InternalServerErrorException(
  //   `Unexpected server error, check server logs`,
  // );
};
