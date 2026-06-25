import { Module } from '@nestjs/common';
import { PrismaProfessoresRepository } from './repositories/prisma-professores.repository';
import { PROFESSORES_REPOSITORY } from './repositories/professores.repository';
import { ProfessoresController } from './professores.controller';
import { ProfessoresService } from './professores.service';

@Module({
  controllers: [ProfessoresController],
  providers: [
    ProfessoresService,
    { provide: PROFESSORES_REPOSITORY, useClass: PrismaProfessoresRepository },
  ],
  exports: [ProfessoresService],
})
export class ProfessoresModule {}
