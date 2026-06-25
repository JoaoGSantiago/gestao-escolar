import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAlunoDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  nome: string;

  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A turma (turmaId) é obrigatória.' })
  turmaId: string;

  @IsOptional()
  @IsString()
  matricula?: string;

  @IsOptional()
  @IsString()
  dataNascimento?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
