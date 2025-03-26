import {
  HttpException,
  Logger,
} from '@nestjs/common';
import { ErrorCode } from '../Interfaces/ErrorCode.Interface';
import { Response } from '../Interfaces/Response.Interface';

export class HandleExeceptions extends HttpException {

  private readonly logger: Logger;


  constructor(serviceName: string, error: Error, errorCode: ErrorCode) {    

    const response: Response = {
      ok: false,
      message: error.message || 'Error interno',
      body: {},
    };

    super(response, errorCode);

    this.logger = new Logger(serviceName);
    
    // Loguea el error con el nombre del servicio
    this.logger.error(`${error.name}: ${error.message}`, error.stack);
  }

}
