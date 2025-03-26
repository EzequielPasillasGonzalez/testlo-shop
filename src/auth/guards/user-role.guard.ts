import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators';
import { User } from 'src/auth/entities/users.entity';
import { HandleExeceptions } from 'src/common/helpers';
import { ErrorCode } from 'src/common/Interfaces/ErrorCode.Interface';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    try {
      const validRoles: string[] = this.reflector.get(
        META_ROLES,
        context.getHandler(),
      );

      if (!validRoles) {
        return true;
      }

      if (validRoles.length === 0) {
        return true;
      }

      const req = context.switchToHttp().getRequest();
      const user: User = req.user;

      if (!user) {
        throw new BadRequestException('User not found (guard)');
      }

      for (const role of user.roles) {
        if (validRoles.includes(role)) {
          return true;
        }
      }

      throw new ForbiddenException(`Not permission`);
    } catch (error) {

      throw new HandleExeceptions('AuthGuard', error, ErrorCode.BAD_REQUEST);
    }

  }
}
