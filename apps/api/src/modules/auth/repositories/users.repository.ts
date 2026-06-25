import { User } from '@prisma/client';

/**
 * Contrato da camada de acesso a dados de usuários (Repository Pattern).
 * Os services dependem desta abstração, não da implementação concreta (DIP).
 */
export abstract class UsersRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
}

/** Token de injeção para a abstração acima. */
export const USERS_REPOSITORY = 'USERS_REPOSITORY';
