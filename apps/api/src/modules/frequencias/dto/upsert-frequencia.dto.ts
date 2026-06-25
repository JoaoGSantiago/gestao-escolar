import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class UpsertFrequenciaDto {
  @IsString()
  @IsNotEmpty({ message: 'O alunoId é obrigatório.' })
  alunoId: string;

  @IsString()
  @IsNotEmpty({ message: 'O disciplinaId é obrigatório.' })
  disciplinaId: string;

  @IsOptional()
  @IsInt({ message: 'aulasPrevistas deve ser um inteiro.' })
  @Min(0)
  aulasPrevistas?: number;

  @IsInt({ message: 'presencas deve ser um inteiro.' })
  @Min(0)
  presencas: number;

  @IsInt({ message: 'faltas deve ser um inteiro.' })
  @Min(0)
  faltas: number;
}
