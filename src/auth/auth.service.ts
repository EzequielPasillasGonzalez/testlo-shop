import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { HandleExeceptions } from 'src/common/helpers';
import { LoginUserDto } from './dto/login-user.dto ';
import { JwtPayload } from './interfaces/';
import { JwtService } from '@nestjs/jwt';
import { ErrorCode } from 'src/common/Interfaces/ErrorCode.Interface';
@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;

    const user = this.userRepository.create({
      ...userData,
      password: bcrypt.hashSync(password, 10),
    });

    try {
      const { password, isActive, ...userCreated } =
        await this.userRepository.save(user);

      const payload: JwtPayload = {
        id: user.id,
      };
      return {
        ...userCreated,
        token: this.getJwtToken(payload),
      };
    } catch (error) {
      new HandleExeceptions('AuthService', error, ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;

      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true }, // Solo trae estos campos
      });

      if (!user) {
        throw new UnauthorizedException('Credentials not valid (email)');
      }

      if (!bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException('Credentials not valid (passsword)');
      }

      const payload: JwtPayload = {
        id: user.id,
      };

      return {
        token: this.getJwtToken(payload),
      };
    } catch (error) {
      new HandleExeceptions('AuthService', error, ErrorCode.UNAUTHORIZED)
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  }

  async checkAuthStatus(id: string) {

    try {
      const user = await this.userRepository.findOne({
        where: { id },
        select: { email: true, fullName: true, roles: true, isActive: true }, // Solo trae estos campos
      });

      if (!user) {
        throw new UnauthorizedException('check Auth no passed');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('User is not active');
      }

      const payload: JwtPayload = {
        id: user.id,
      };

      const token = this.getJwtToken(payload);

      return {
        user,
        token,
      };
    } catch (error) {
      new HandleExeceptions('AuthService', error, ErrorCode.UNAUTHORIZED)


    }

  }
}
