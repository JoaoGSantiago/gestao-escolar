# ---------- Stage 1: build ----------
FROM node:20-alpine AS builder
WORKDIR /app

# OpenSSL é necessário para os engines do Prisma no Alpine.
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig*.json nest-cli.json ./
COPY src ./src
RUN npm run build

# ---------- Stage 2: runtime ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl

# Dependências completas, incluindo devDeps (prisma CLI + ts-node para o seed).
# --include=dev força as devDependencies mesmo com NODE_ENV=production.
COPY package*.json ./
RUN npm ci --include=dev

# Artefatos do build + cliente Prisma gerado + migrations + seed.
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma
# tsconfig é necessário para o ts-node compilar o seed com a config correta.
COPY tsconfig.json ./
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3333
ENTRYPOINT ["./docker-entrypoint.sh"]
