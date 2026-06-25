import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateNotaDto {
  @IsString()
  @IsNotEmpty({ message: 'O alunoId é obrigatório.' })
  alunoId: string;

  @IsString()
  @IsNotEmpty({ message: 'O disciplinaId é obrigatório.' })
  disciplinaId: string;

  @IsString()
  @IsNotEmpty({ message: 'A avaliação é obrigatória.' })
  avaliacao: string;

  @IsNumber({}, { message: 'O valor da nota deve ser numérico.' })
  @Min(0, { message: 'A nota mínima é 0.' })
  @Max(10, { message: 'A nota máxima é 10.' })
  valor: number;

  @IsInt({ message: 'O bimestre deve ser um número inteiro.' })
  @Min(1, { message: 'O bimestre mínimo é 1.' })
  @Max(4, { message: 'O bimestre máximo é 4.' })
  bimestre: number;
}
