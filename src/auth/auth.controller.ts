import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Headers,
  SetMetadata,
} from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';

import { LoginUserDto, CreateUserDto } from './dto/';
import { handleResponse } from 'src/common/helpers';
import { Auth, GetUser, RoleProtected } from './decorators/';
import { User } from './entities/users.entity';
import { RawHeaders } from 'src/common/decorators/get-raw-headers.decorator';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth') // Tag para documentacion
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.authService.create(createUserDto);
    return handleResponse(true, newUser, 'Usuario creado');
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    const login = await this.authService.login(loginUserDto);
    return handleResponse(true, login, 'Loggeado con exito');
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user.id);
  }

  @Get('private')
  @UseGuards(AuthGuard()) // Para que nos envien un token en la peticion
  testingPrivateRoute(
    @Request() request: Express.Request,

    @GetUser() user: User, // Custom decorator
    // 'nombre' es la data que se le envia al decorator

    @GetUser('email') userEmail: string,

    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return handleResponse(true, { user, userEmail, rawHeaders, headers }, 'Holi');
  }

  //* primer metodo para proteger rutas
  // @Get('admin')
  // @SetMetadata('roles', ['admin', 'super-user']) // * Se ponen los roles a verificar
  // @UseGuards(AuthGuard(), UserRoleGuard) // * El UserRoleGuard ->  guardpersonalizado
  // adminRoute(@GetUser() user: User) {
  //   return handleResponse(true, user, 'Ruta pasada');
  // }

  // * segundo metodo para proteger rutas
  // @Get('admin/protected')
  // @RoleProtected(ValidRoles.superUser) // Se envia el rol permitido
  // @UseGuards(AuthGuard(), UserRoleGuard)
  // adminRoute(@GetUser() user: User) {
  //   return handleResponse(true, user, 'Ruta pasada');
  // }

  // * tercer metodo para proteger rutas (recomendado)
  @Get('admin/protected/recommend')
  //Hace validacion de token
  // Hace validacion de rol
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  adminRoute(@GetUser() user: User) {
    return handleResponse(true, user, 'Ruta pasada');
  }
}
