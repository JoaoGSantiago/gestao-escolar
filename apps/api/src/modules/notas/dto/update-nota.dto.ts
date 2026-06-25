import { IsNumber, Max, Min } from 'class-validator';

export class UpdateNotaDto {
  @IsNumber({}, { message: 'O valor da nota deve ser numérico.' })
  @Min(0, { message: 'A nota mínima é 0.' })
  @Max(10, { message: 'A nota máxima é 10.' })
  valor: number;
}
