# Aura API

API desenvolvida em **NestJS + Prisma + SQLite**

---

## Tecnologias

- NestJS
- Prisma ORM
- SQLite
- Swagger (OpenAPI)
- TypeScript

---

## Pré-requisitos

- Node.js >= 18
- npm >= 9
- Git

---

## Instalação do projeto

```bash
npm install
```

---

## Prisma Setup

Ao iniciar o projeto execute os comandos:

```bash
npx prisma migrate deploy
npx prisma generate
```

Quando você alterar o arquivo prisma/schema.prisma, crie uma nova migration com:

```bash
npx prisma migrate dev --name nome_da_migration
```

Execute novamente:

```bash
npx prisma generate
```

---

## Rodando o projeto

```bash
npm run start:dev
```

API: http://localhost:3000/api

Swagger: http://localhost:3000/docs
