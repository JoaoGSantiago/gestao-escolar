import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import {
  USERS_REPOSITORY,
  UsersRepository,
} from './repositories/users.repository';

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    nome: string;
    email: string;
    role: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, senha }: LoginDto): Promise<LoginResponse> {
    const user = await this.usersRepository.findByEmail(email);

    const senhaConfere =
      user && (await bcrypt.compare(senha, user.senhaHash));

    if (!user || !senhaConfere) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
    };
  }

  async perfil(userId: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
    };
  }
}
