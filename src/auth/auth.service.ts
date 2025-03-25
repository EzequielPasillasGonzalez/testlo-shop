import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { handleExceptions } from 'src/common/helpers';
import { LoginUserDto } from './dto/login-user.dto ';
@Injectable()
export class AuthService {

  private readonly logger: Logger = new Logger('AuthService')

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
  }


  async create(createUserDto: CreateUserDto) {

    const { password, ...userData } = createUserDto



    const user = this.userRepository.create({
      ...userData,
      password: bcrypt.hashSync(password, 10)
    })

    try {
      const { password, isActive,...userCreated } = await this.userRepository.save(user)

      return userCreated
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`${error.name}: ${error.message}`, error.stack);
      } else {
        this.logger.error('Unexpected error', error);
      }
      handleExceptions(error)
    }

  }


  async login(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto

      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true } // Solo trae estos campos
      })

      if (!user) {
        throw new UnauthorizedException('Credentials not valid (email)')
      }

      if(!bcrypt.compareSync(password, user.password)){
        throw new UnauthorizedException('Credentials not valid (passsword)')
      }


      return user

    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`${error.name}: ${error.message}`, error.stack);
      } else {
        this.logger.error('Unexpected error', error);
      }
      handleExceptions(error)
    }
  }


}
