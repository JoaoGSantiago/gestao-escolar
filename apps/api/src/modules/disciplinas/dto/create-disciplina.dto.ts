import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateDisciplinaDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da disciplina é obrigatório.' })
  nome: string;

  @IsInt({ message: 'A carga horária deve ser um número inteiro.' })
  @Min(1, { message: 'A carga horária deve ser maior que zero.' })
  cargaHoraria: number;

  @IsOptional()
  @IsString()
  professorId?: string;

  @IsOptional()
  @IsString()
  turmaId?: string;
}
