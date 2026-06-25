import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { AlunosModule } from './modules/alunos/alunos.module';
import { ProfessoresModule } from './modules/professores/professores.module';
import { TurmasModule } from './modules/turmas/turmas.module';
import { DisciplinasModule } from './modules/disciplinas/disciplinas.module';
import { NotasModule } from './modules/notas/notas.module';
import { FrequenciasModule } from './modules/frequencias/frequencias.module';
import { AcademicoModule } from './modules/academico/academico.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AlunosModule,
    ProfessoresModule,
    TurmasModule,
    DisciplinasModule,
    NotasModule,
    FrequenciasModule,
    AcademicoModule,
  ],
})
export class AppModule {}
