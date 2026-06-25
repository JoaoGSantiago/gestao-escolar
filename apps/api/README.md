# EduGestão — Backend (API)

API REST do sistema de gestão escolar construída com **NestJS**, **Prisma ORM** e
**PostgreSQL**.

## Stack e decisões técnicas

- **Framework:** NestJS 10
- **ORM:** Prisma (PostgreSQL)
- **Autenticação:** JWT (Passport) + senhas com hash bcrypt
- **Validação:** `class-validator` + `ValidationPipe` global (whitelist + transform)
- **Padrões:** Repository Pattern, DTOs, princípios SOLID
- **Testes:** Jest (unitários da camada de Services)

## Arquitetura

Cada recurso é um **módulo** isolado, com responsabilidades separadas:

```
src/
├── main.ts                     # bootstrap, CORS, prefixo /api, pipes e filtros globais
├── app.module.ts               # composição dos módulos
├── prisma/                     # PrismaService + PrismaModule (global)
├── common/                     # filtros, guards-decorators, enums e utils compartilhados
└── modules/
    ├── auth/                   # login, JWT, guards (JwtAuthGuard + RolesGuard globais)
    ├── alunos/
    ├── professores/
    ├── turmas/
    ├── disciplinas/
    ├── notas/
    └── frequencias/
        ├── dto/                # DTOs de entrada (validados)
        ├── repositories/       # contrato (abstrato) + implementação Prisma
        ├── *.service.ts        # regra de negócio (depende da abstração do repositório)
        ├── *.controller.ts     # rotas HTTP
        └── *.module.ts
```

### SOLID / Repository Pattern

Cada módulo define uma classe **abstrata** de repositório (ex.: `AlunosRepository`)
e uma implementação concreta com Prisma (`PrismaAlunosRepository`). Os Services
dependem da abstração (token de injeção), não da implementação — **Dependency
Inversion**. Isso permite trocar o ORM ou mockar o repositório nos testes sem
alterar a regra de negócio.

## Autenticação e autorização

- Todas as rotas exigem **JWT** (guard global), exceto `POST /auth/login` (`@Public()`).
- `@Roles(Role.COORDENACAO)` restringe operações de escrita de cadastros à coordenação.
- Notas e frequências podem ser lançadas também por **professores**.

## Endpoints

Base: `http://localhost:3333/api`

| Método | Rota                         | Papel        | Descrição                          |
| ------ | ---------------------------- | ------------ | ---------------------------------- |
| POST   | `/auth/login`                | público      | Autentica e retorna o token JWT    |
| GET    | `/auth/perfil`               | autenticado  | Dados do usuário logado            |
| GET    | `/alunos` `?turmaId=`        | autenticado  | Lista alunos (filtro por turma)    |
| GET    | `/alunos/:id`                | autenticado  | Detalha aluno                      |
| POST   | `/alunos`                    | coordenação  | Cria aluno                         |
| PATCH  | `/alunos/:id`                | coordenação  | Atualiza aluno                     |
| DELETE | `/alunos/:id`                | coordenação  | Remove aluno                       |
| GET    | `/professores`               | autenticado  | Lista professores                  |
| POST   | `/professores`               | coordenação  | Cria professor                     |
| PATCH/DELETE | `/professores/:id`     | coordenação  | Atualiza / remove professor        |
| GET    | `/turmas`                    | autenticado  | Lista turmas (com nº de alunos)    |
| POST/PATCH/DELETE | `/turmas[/:id]`   | coordenação  | CRUD de turmas                     |
| GET    | `/disciplinas`               | autenticado  | Lista disciplinas                  |
| POST/PATCH/DELETE | `/disciplinas[/:id]` | coordenação | CRUD de disciplinas              |
| GET    | `/notas` `?alunoId=&disciplinaId=` | autenticado | Lista notas (com filtros)    |
| POST   | `/notas`                     | autenticado  | Lança/atualiza nota (upsert)       |
| PATCH/DELETE | `/notas/:id`           | autenticado  | Atualiza valor / remove nota       |
| GET    | `/frequencias` `?alunoId=&disciplinaId=` | autenticado | Lista frequências        |
| POST/PUT | `/frequencias`             | autenticado  | Lança/atualiza frequência (upsert) |
| DELETE | `/frequencias/:id`           | autenticado  | Remove frequência                  |
| GET    | `/academico/alunos/:id/boletim` | autenticado | Boletim (médias, frequência, situação) |
| POST   | `/academico/alunos/:id/aprovar` | coordenação | Aprova e promove o aluno individualmente |
| POST   | `/academico/turmas/:id/encerrar-ano` | coordenação | Encerra o ano e promove os aprovados |

### Módulo Acadêmico (ano letivo)

Modela a realidade de uma escola de educação básica:

- **12 séries** (escada de progressão): 1º–5º ano (Fundamental I), 6º–9º ano
  (Fundamental II) e 1ª–3ª série (Ensino Médio), via campo `ordem` na turma.
- **Boletim**: média por disciplina, frequência e situação
  (`Aprovado`/`Recuperação`/`Reprovado`), além da situação final projetada.
- **Regras de aprovação** (`academico.rules.ts`): média ≥ 6,0 **e** frequência
  ≥ 75% em todas as disciplinas.
- **Encerramento do ano**: a coordenação encerra a turma; os aprovados são
  promovidos para a série seguinte (`ordem + 1`), os concluintes da 3ª série do
  EM viram **FORMADO**, e os reprovados permanecem. As regras puras são cobertas
  por testes unitários.

## Scripts

```bash
npm run start:dev      # API em watch (http://localhost:3333/api)
npm run prisma:migrate # cria/aplica migrations
npm run prisma:seed    # popula o banco com dados mockados + usuários
npm run db:reset       # reseta o banco e re-semeia
npm test               # testes unitários
npm run test:cov       # testes com cobertura
```

## Testes

A camada de **Services** é coberta por testes unitários (Jest), com os
repositórios mockados. Cobre regras de negócio como upsert de notas, recálculo de
percentual de frequência, mapeamento de respostas e tratamento de erros
(404/409/400).

```bash
npm run test:cov
```

## Variáveis de ambiente (`.env`)

| Variável         | Exemplo                                                              |
| ---------------- | ------------------------------------------------------------------- |
| `DATABASE_URL`   | `postgresql://postgres:postgres@localhost:5432/gestao_escolar`      |
| `JWT_SECRET`     | `troque-em-producao`                                                |
| `JWT_EXPIRES_IN` | `1d`                                                                |
| `PORT`           | `3333`                                                              |
| `FRONTEND_URL`   | `http://localhost:3000` (origem liberada no CORS)                   |
