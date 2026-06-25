import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';

/**
 * Autoriza com base nos papéis exigidos por @Roles().
 * Sem @Roles(), libera para qualquer usuário autenticado.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const allowed = requiredRoles.some((role) => user?.role === role);

    if (!allowed) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este recurso.',
      );
    }
    return true;
  }
}
