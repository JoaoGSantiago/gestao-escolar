import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';

/**
 * Restringe um handler/controller aos papéis informados.
 * Ex.: @Roles(Role.COORDENACAO)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
