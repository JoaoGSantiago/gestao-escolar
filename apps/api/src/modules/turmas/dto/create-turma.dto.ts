import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Nivel } from '@prisma/client';

export class CreateTurmaDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da turma é obrigatório.' })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'O turno é obrigatório.' })
  turno: string;

  @IsOptional()
  @IsString()
  sala?: string;

  @IsOptional()
  @IsEnum(Nivel, {
    message: 'Nível inválido (FUNDAMENTAL_I, FUNDAMENTAL_II ou MEDIO).',
  })
  nivel?: Nivel;

  @IsOptional()
  @IsInt({ message: 'A ordem deve ser um número inteiro.' })
  @Min(1)
  @Max(12)
  ordem?: number;

  @IsOptional()
  @IsInt({ message: 'O ano letivo deve ser um número inteiro.' })
  @Min(2000)
  anoLetivo?: number;
}
