import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticatedUser } from '../../../common/decorators/current-user.decorator';

interface JwtPayload {
  sub: string;
  email: string;
  nome: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET', 'change-me'),
    });
  }

  /** O retorno é anexado a request.user. */
  validate(payload: JwtPayload): AuthenticatedUser {
    return {
      sub: payload.sub,
      email: payload.email,
      nome: payload.nome,
      role: payload.role,
    };
  }
}
