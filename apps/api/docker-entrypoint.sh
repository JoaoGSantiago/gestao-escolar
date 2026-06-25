#!/bin/sh
set -e

# Cria/atualiza o schema no banco direto a partir do schema.prisma.
# (db push não depende de arquivos de migration — ideal para subir do zero.)
echo "⏳ Sincronizando o schema do banco (prisma db push)..."
npx prisma db push --skip-generate

# Conta os usuários existentes para decidir se precisa popular.
USER_COUNT=$(node -e "const{PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.user.count().then(c=>{console.log(c);return p.\$disconnect()}).catch(()=>{console.log(0)})" 2>/dev/null || echo 0)

# SEED_MODE=reset  -> repovoa os dados mockados a cada inicialização (demo sempre limpa).
# SEED_MODE=never  -> nunca executa o seed.
# (padrão)         -> popula apenas quando o banco está vazio.
if [ "$SEED_MODE" = "never" ]; then
  echo "⏭️  SEED_MODE=never — pulando seed."
elif [ "$SEED_MODE" = "reset" ]; then
  echo "🔁 SEED_MODE=reset — repovoando dados mockados..."
  npx ts-node --transpile-only prisma/seed.ts
elif [ "$USER_COUNT" = "0" ]; then
  echo "🌱 Banco vazio — populando dados mockados..."
  npx ts-node --transpile-only prisma/seed.ts
else
  echo "✅ Banco já populado ($USER_COUNT usuários) — pulando seed."
fi

echo "🚀 Iniciando API..."
exec node dist/main.js
