import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';

import { LoginUserDto, CreateUserDto } from './dto/';
import { handleResponse } from 'src/common/helpers';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.authService.create(createUserDto);
    return handleResponse(newUser, 'Usuario creado')
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    const login = await this.authService.login(loginUserDto);
    return handleResponse(login, 'Loggeado con exito')
  }


}
