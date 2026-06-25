import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import {
  USERS_REPOSITORY,
  UsersRepository,
} from './repositories/users.repository';

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: jest.Mocked<UsersRepository>;
  let jwtService: jest.Mocked<JwtService>;

  const usuario: User = {
    id: 'USR1',
    nome: 'Coord',
    email: 'coordenacao@escola.edu.br',
    senhaHash: bcrypt.hashSync('Coord@123', 10),
    role: Role.COORDENACAO,
    professorId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: USERS_REPOSITORY,
          useValue: { findByEmail: jest.fn(), findById: jest.fn() },
        },
        { provide: JwtService, useValue: { signAsync: jest.fn() } },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
    usersRepository = moduleRef.get(USERS_REPOSITORY);
    jwtService = moduleRef.get(JwtService);
  });

  describe('login', () => {
    it('retorna token e dados do usuário com credenciais válidas', async () => {
      usersRepository.findByEmail.mockResolvedValue(usuario);
      jwtService.signAsync.mockResolvedValue('jwt-token');

      const result = await service.login({
        email: usuario.email,
        senha: 'Coord@123',
      });

      expect(result.accessToken).toBe('jwt-token');
      expect(result.user).toEqual({
        id: 'USR1',
        nome: 'Coord',
        email: usuario.email,
        role: Role.COORDENACAO,
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({ sub: 'USR1', role: Role.COORDENACAO }),
      );
    });

    it('lança UnauthorizedException quando o usuário não existe', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'x@x.com', senha: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('lança UnauthorizedException quando a senha está incorreta', async () => {
      usersRepository.findByEmail.mockResolvedValue(usuario);

      await expect(
        service.login({ email: usuario.email, senha: 'errada' }),
      ).rejects.toThrow(UnauthorizedException);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });

  describe('perfil', () => {
    it('retorna os dados do usuário autenticado', async () => {
      usersRepository.findById.mockResolvedValue(usuario);

      const result = await service.perfil('USR1');

      expect(result.email).toBe(usuario.email);
      expect(usersRepository.findById).toHaveBeenCalledWith('USR1');
    });

    it('lança UnauthorizedException quando o usuário não é encontrado', async () => {
      usersRepository.findById.mockResolvedValue(null);

      await expect(service.perfil('ZZZ')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
