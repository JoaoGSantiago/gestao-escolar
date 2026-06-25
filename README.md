# EduGestão — Sistema de Gestão Escolar

Monorepo com **frontend (Next.js)** e **backend (NestJS + Prisma + PostgreSQL)**.

```
gestao-escolar/
├── apps/
│   ├── web/   # Frontend Next.js 16 (React 19, Tailwind)
│   └── api/   # Backend NestJS 10 (Prisma, PostgreSQL, JWT)
├── docker-compose.yml   # PostgreSQL local
└── package.json         # Scripts de orquestração do monorepo
```

## Pré-requisitos

- Node.js 20+
- Docker (para o PostgreSQL via Docker Compose)

## 🐳 Rodando tudo com Docker (mais simples)

Sobe **banco + API + frontend** com um comando (a API aplica migrations e
faz o seed automaticamente na primeira subida):

```bash
npm run docker:up      # docker compose up -d --build
```

Acesse:

- Frontend: http://localhost:3000
- API: http://localhost:3333/api

```bash
npm run docker:logs    # acompanha os logs
npm run docker:down    # para tudo
```

> As portas 3000, 3333 e 5432 precisam estar livres no host (encerre o
> `npm run web:dev`/`api:dev` antes de subir a stack Docker).

## Passo a passo (desenvolvimento local, sem Docker para os apps)

```bash
# 1. Sobe o banco PostgreSQL
npm run db:up

# 2. Instala as dependências do backend e prepara o banco (migration + seed)
npm run api:install
npm run api:setup          # roda prisma migrate dev + seed com dados mockados

# 3. Em um terminal: sobe a API (http://localhost:3333/api)
npm run api:dev

# 4. Em outro terminal: instala e sobe o frontend (http://localhost:3000)
npm run web:install
npm run web:dev
```

> O frontend lê a URL da API em `apps/web/.env.local` (`NEXT_PUBLIC_API_URL`).
> O backend lê as variáveis em `apps/api/.env`.

## 🔐 Credenciais de acesso (criadas pelo seed)

| Papel        | E-mail                       | Senha       | Redireciona para        |
| ------------ | ---------------------------- | ----------- | ----------------------- |
| Coordenação  | `coordenacao@escola.edu.br`  | `Coord@123` | `/dashboard`            |
| Professor    | `edvonaldo@escola.edu.br`    | `Prof@123`  | `/professor/dashboard`  |

A coordenação tem acesso de escrita (criar/editar/excluir). O professor tem
acesso de leitura e pode lançar **notas** e **frequências**.

## Funcionalidades de plataforma

- **Educação básica completa**: 12 séries (Fundamental I e II + Ensino Médio).
- **Boletim do aluno**: média por disciplina, frequência e situação acadêmica.
- **Ano letivo / aprovação**: na tela **Ano Letivo**, a coordenação encerra o
  ano de uma turma e o sistema **avalia e promove** os aprovados para a série
  seguinte (média ≥ 6 e frequência ≥ 75%); concluintes do EM são **formados**.
  Também é possível aprovar/promover um aluno individualmente pelo boletim.

## Scripts do monorepo

| Script                | Descrição                                          |
| --------------------- | -------------------------------------------------- |
| `npm run db:up`       | Sobe o PostgreSQL (Docker Compose)                 |
| `npm run db:down`     | Para o PostgreSQL                                   |
| `npm run api:setup`   | Migration + seed                                   |
| `npm run api:dev`     | API em modo watch                                  |
| `npm run api:test`    | Testes unitários do backend                        |
| `npm run web:dev`     | Frontend em modo dev                               |

## Arquitetura do backend

Veja [`apps/api/README.md`](apps/api/README.md) para detalhes (módulos, Repository
Pattern, DTOs, validação, autenticação e testes).
