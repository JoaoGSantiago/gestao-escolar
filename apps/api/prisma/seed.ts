import {
  Nivel,
  Prisma,
  PrismaClient,
  Role,
  SituacaoAluno,
  Status,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ANO_LETIVO = 2026;
const SENHA_COORDENACAO = 'Coord@123';
const SENHA_PROFESSOR = 'Prof@123';

// ----------------------------------------------------------------------------
// Catálogo de séries (escada de progressão completa da educação básica)
// ----------------------------------------------------------------------------
interface TurmaSeed {
  id: string;
  nome: string;
  nivel: Nivel;
  ordem: number;
  turno: string;
  sala: string;
  disciplinas: string[];
}

const NUCLEO_FUND_I = [
  'Português',
  'Matemática',
  'Ciências',
  'História',
  'Geografia',
  'Artes',
  'Educação Física',
];
const NUCLEO_FUND_II = [
  'Português',
  'Matemática',
  'Ciências',
  'História',
  'Geografia',
  'Inglês',
  'Educação Física',
];
const NUCLEO_MEDIO = [
  'Português',
  'Matemática',
  'Física',
  'Química',
  'Biologia',
  'História',
  'Geografia',
  'Inglês',
];

const escada: Array<Omit<TurmaSeed, 'id' | 'sala'>> = [
  { nome: '1º Ano', nivel: Nivel.FUNDAMENTAL_I, ordem: 1, turno: 'Matutino', disciplinas: NUCLEO_FUND_I },
  { nome: '2º Ano', nivel: Nivel.FUNDAMENTAL_I, ordem: 2, turno: 'Matutino', disciplinas: NUCLEO_FUND_I },
  { nome: '3º Ano', nivel: Nivel.FUNDAMENTAL_I, ordem: 3, turno: 'Matutino', disciplinas: NUCLEO_FUND_I },
  { nome: '4º Ano', nivel: Nivel.FUNDAMENTAL_I, ordem: 4, turno: 'Vespertino', disciplinas: NUCLEO_FUND_I },
  { nome: '5º Ano', nivel: Nivel.FUNDAMENTAL_I, ordem: 5, turno: 'Vespertino', disciplinas: NUCLEO_FUND_I },
  { nome: '6º Ano', nivel: Nivel.FUNDAMENTAL_II, ordem: 6, turno: 'Matutino', disciplinas: NUCLEO_FUND_II },
  { nome: '7º Ano', nivel: Nivel.FUNDAMENTAL_II, ordem: 7, turno: 'Matutino', disciplinas: NUCLEO_FUND_II },
  { nome: '8º Ano', nivel: Nivel.FUNDAMENTAL_II, ordem: 8, turno: 'Vespertino', disciplinas: NUCLEO_FUND_II },
  { nome: '9º Ano', nivel: Nivel.FUNDAMENTAL_II, ordem: 9, turno: 'Vespertino', disciplinas: NUCLEO_FUND_II },
  { nome: '1ª Série EM', nivel: Nivel.MEDIO, ordem: 10, turno: 'Matutino', disciplinas: NUCLEO_MEDIO },
  { nome: '2ª Série EM', nivel: Nivel.MEDIO, ordem: 11, turno: 'Matutino', disciplinas: NUCLEO_MEDIO },
  { nome: '3ª Série EM', nivel: Nivel.MEDIO, ordem: 12, turno: 'Matutino', disciplinas: NUCLEO_MEDIO },
];

// Professor responsável por cada disciplina (um docente por área).
const corpoDocente = [
  { disciplina: 'Matemática', nome: 'Edvonaldo Silva', email: 'edvonaldo@escola.edu.br' },
  { disciplina: 'Português', nome: 'Ítalo Santos', email: 'italo@escola.edu.br' },
  { disciplina: 'Ciências', nome: 'Gabriel Souza', email: 'gabriel@escola.edu.br' },
  { disciplina: 'História', nome: 'Larissa Moura', email: 'larissa@escola.edu.br' },
  { disciplina: 'Geografia', nome: 'Paulo Henrique', email: 'paulo.h@escola.edu.br' },
  { disciplina: 'Inglês', nome: 'Sophia Almeida', email: 'sophia@escola.edu.br' },
  { disciplina: 'Física', nome: 'Rodrigo Nunes', email: 'rodrigo@escola.edu.br' },
  { disciplina: 'Química', nome: 'Camila Torres', email: 'camila@escola.edu.br' },
  { disciplina: 'Biologia', nome: 'Tiago Barbosa', email: 'tiago@escola.edu.br' },
  { disciplina: 'Artes', nome: 'Renata Dias', email: 'renata@escola.edu.br' },
  { disciplina: 'Educação Física', nome: 'Bruno Carvalho', email: 'bruno@escola.edu.br' },
];

const cargaHorariaPorDisciplina: Record<string, number> = {
  Português: 80,
  Matemática: 80,
  Ciências: 60,
  História: 60,
  Geografia: 60,
  Inglês: 40,
  Física: 60,
  Química: 60,
  Biologia: 60,
  Artes: 40,
  'Educação Física': 40,
};

// Pool de nomes para gerar alunos.
const primeirosNomes = [
  'João', 'Maria', 'Pedro', 'Ana', 'Lucas', 'Beatriz', 'Gabriel', 'Júlia',
  'Mateus', 'Laura', 'Rafael', 'Sofia', 'Felipe', 'Helena', 'Bruno', 'Clara',
  'Gustavo', 'Manuela', 'Daniel', 'Alice', 'Vinícius', 'Lara', 'Enzo', 'Cecília',
];
const sobrenomes = [
  'Silva', 'Souza', 'Oliveira', 'Santos', 'Lima', 'Ferreira', 'Costa', 'Rocha',
  'Martins', 'Almeida', 'Barbosa', 'Nunes', 'Ribeiro', 'Carvalho', 'Gomes',
];

// Gerador pseudoaleatório determinístico (resultados reproduzíveis).
let semente = 42;
function rand(): number {
  semente = (semente * 1103515245 + 12345) & 0x7fffffff;
  return semente / 0x7fffffff;
}
function entre(min: number, max: number): number {
  return min + rand() * (max - min);
}

function percentual(presencas: number, aulasPrevistas: number): number {
  if (!aulasPrevistas) return 0;
  return Math.round((presencas / aulasPrevistas) * 1000) / 10;
}

async function main() {
  console.log('🧹 Limpando dados existentes...');
  await prisma.frequencia.deleteMany();
  await prisma.nota.deleteMany();
  await prisma.user.deleteMany();
  await prisma.disciplina.deleteMany();
  await prisma.aluno.deleteMany();
  await prisma.professor.deleteMany();
  await prisma.turma.deleteMany();

  // -- Professores --------------------------------------------------------
  console.log('👩‍🏫 Inserindo professores...');
  const professores = corpoDocente.map((p, i) => ({
    id: `PROF${String(i + 1).padStart(3, '0')}`,
    nome: p.nome,
    email: p.email,
    telefone: '(82) 99999-0000',
    status: Status.ATIVO,
  }));
  await prisma.professor.createMany({ data: professores });
  const professorPorDisciplina = new Map(
    corpoDocente.map((p, i) => [p.disciplina, professores[i].id]),
  );

  // -- Turmas -------------------------------------------------------------
  console.log('🏫 Inserindo turmas (12 séries)...');
  const turmas: TurmaSeed[] = escada.map((t, i) => ({
    ...t,
    id: `TUR${String(i + 1).padStart(3, '0')}`,
    sala: `Sala ${i + 1}`,
  }));
  await prisma.turma.createMany({
    data: turmas.map((t) => ({
      id: t.id,
      nome: t.nome,
      turno: t.turno,
      sala: t.sala,
      nivel: t.nivel,
      ordem: t.ordem,
      anoLetivo: ANO_LETIVO,
    })),
  });

  // -- Disciplinas (por turma) -------------------------------------------
  console.log('📚 Inserindo disciplinas...');
  const disciplinas: Prisma.DisciplinaCreateManyInput[] = [];
  let discSeq = 1;
  const disciplinasPorTurma = new Map<string, { id: string; nome: string }[]>();
  for (const turma of turmas) {
    const lista: { id: string; nome: string }[] = [];
    for (const nome of turma.disciplinas) {
      const id = `DIS${String(discSeq++).padStart(3, '0')}`;
      disciplinas.push({
        id,
        nome,
        cargaHoraria: cargaHorariaPorDisciplina[nome] ?? 60,
        professorId: professorPorDisciplina.get(nome) ?? null,
        turmaId: turma.id,
      });
      lista.push({ id, nome });
    }
    disciplinasPorTurma.set(turma.id, lista);
  }
  await prisma.disciplina.createMany({ data: disciplinas });

  // -- Alunos + Notas + Frequências --------------------------------------
  console.log('🧑‍🎓 Inserindo alunos, notas e frequências...');
  const alunos: Prisma.AlunoCreateManyInput[] = [];
  const notas: Prisma.NotaCreateManyInput[] = [];
  const frequencias: Prisma.FrequenciaCreateManyInput[] = [];
  let alunoSeq = 1;

  for (const turma of turmas) {
    const qtd = 5; // 5 alunos por turma
    const discTurma = disciplinasPorTurma.get(turma.id) ?? [];
    for (let i = 0; i < qtd; i++) {
      const id = `ALU${String(alunoSeq).padStart(3, '0')}`;
      const nome = `${primeirosNomes[(alunoSeq * 7) % primeirosNomes.length]} ${
        sobrenomes[(alunoSeq * 3) % sobrenomes.length]
      }`;
      const email = `aluno${alunoSeq}@aluno.escola.edu.br`;
      alunos.push({
        id,
        nome,
        email,
        matricula: `${ANO_LETIVO}${String(alunoSeq).padStart(4, '0')}`,
        dataNascimento: '2010-03-15',
        status: Status.ATIVO,
        situacao: SituacaoAluno.CURSANDO,
        turmaId: turma.id,
      });

      // Perfil do aluno: ~80% com bom desempenho (aprovados), ~20% em risco.
      const emRisco = rand() < 0.2;
      const base = emRisco ? entre(3.5, 6.0) : entre(6.5, 9.5);
      const fatorPresenca = emRisco ? entre(0.6, 0.78) : entre(0.85, 1);
      const aulasPrevistas = 40;
      for (const disc of discTurma) {
        for (let b = 1; b <= 4; b++) {
          const valor = Math.min(
            10,
            Math.max(0, Math.round((base + entre(-0.8, 0.8)) * 10) / 10),
          );
          notas.push({
            alunoId: id,
            disciplinaId: disc.id,
            avaliacao: `AB${b}`,
            valor,
            bimestre: 1,
          });
        }
        const presencas = Math.round(aulasPrevistas * fatorPresenca);
        const faltas = aulasPrevistas - presencas;
        frequencias.push({
          alunoId: id,
          disciplinaId: disc.id,
          aulasPrevistas,
          presencas,
          faltas,
          percentual: percentual(presencas, aulasPrevistas),
        });
      }
      alunoSeq++;
    }
  }

  await prisma.aluno.createMany({ data: alunos });
  await prisma.nota.createMany({ data: notas });
  await prisma.frequencia.createMany({ data: frequencias });

  // -- Usuários de acesso -------------------------------------------------
  console.log('🔐 Criando usuários de acesso...');
  const [hashCoord, hashProf] = await Promise.all([
    bcrypt.hash(SENHA_COORDENACAO, 10),
    bcrypt.hash(SENHA_PROFESSOR, 10),
  ]);
  await prisma.user.create({
    data: {
      nome: 'Equipe de Coordenação',
      email: 'coordenacao@escola.edu.br',
      senhaHash: hashCoord,
      role: Role.COORDENACAO,
    },
  });
  await prisma.user.create({
    data: {
      nome: 'Edvonaldo Silva',
      email: 'edvonaldo@escola.edu.br',
      senhaHash: hashProf,
      role: Role.PROFESSOR,
      professorId: 'PROF001',
    },
  });

  console.log('\n✅ Seed concluído!');
  console.log(
    `   ${turmas.length} turmas, ${professores.length} professores, ${alunos.length} alunos, ${notas.length} notas.`,
  );
  console.log('   Coordenação → coordenacao@escola.edu.br / Coord@123');
  console.log('   Professor   → edvonaldo@escola.edu.br / Prof@123');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
