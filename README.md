# DevBills

App de controle financeiro pessoal.

## 📋 Sobre

DevBills é um app full-stack para controle de finanças pessoais.
Permite cadastrar transações (receitas e despesas), visualizar
gráficos por categoria e acompanhar o resumo mensal.

## 🗂️ Estrutura

- `api/` — Backend (Node.js + Fastify + Prisma + MongoDB)
- `app/` — Frontend (React + TypeScript + Tailwind)
- `mobile/` — Mobile (React Native — em breve)

## 🚀 Stack

**Frontend:**
- React 19
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Recharts (gráficos)
- React Toastify

**Backend:**
- Node.js
- Fastify
- Prisma
- MongoDB
- Firebase (auth)
- Zod (validação)

## 🛠️ Como rodar

### Pré-requisitos

- Node.js 20+
- Yarn
- Conta no Firebase
- Cluster no MongoDB Atlas

### Backend

```bash
cd api
yarn
yarn dev