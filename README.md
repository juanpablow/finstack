# Finstack

**Sistema de Gestão Financeira Pessoal**

Projeto acadêmico desenvolvido para a **Unifecaf**.

## 📖 Sobre o Projeto

O **Finstack** é uma aplicação web completa para gestão e controle de finanças pessoais. O sistema permite que usuários organizem suas receitas e despesas através de categorias personalizáveis, estabeleçam metas de gastos e acompanhem sua evolução financeira em tempo real através de gráficos interativos.

### Principais Funcionalidades

- 🔐 **Autenticação segura** com NextAuth (email/senha e OAuth)
- 💰 **Controle de renda mensal** com edição em tempo real
- 🎯 **Sistema de metas** por categoria com porcentagens personalizáveis
- 📊 **Visualização gráfica** (donut charts) da distribuição de gastos
- 📝 **Gerenciamento de despesas** (criar, editar, excluir) por categoria
- 💵 **Formatação automática** de valores monetários (R$)
- 📱 **Interface responsiva** para desktop e mobile
- 🔄 **Atualização em tempo real** de gráficos e totais

### Categorias Padrão

O sistema organiza os gastos em 6 categorias principais:
- **Gastos fixos** (40%) - Aluguel, contas, alimentação básica
- **Emergências** (10%) - Fundo de reserva
- **Liberdade** (25%) - Investimentos e independência financeira
- **Conhecimento** (5%) - Cursos, livros, educação
- **Conforto** (10%) - Melhorias de qualidade de vida
- **Prazeres** (10%) - Lazer e entretenimento

## Estrutura do Projeto

```
stackfindover/
├── frontend/          # Next.js Application
├── api/              # Rust API (Actix-web)
└── docker-compose.yml
```

## 🛠️ Tecnologias

### Frontend
- **Next.js 16** - Framework React com App Router
- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset JavaScript com tipagem estática
- **Tailwind CSS v4** - Framework de estilização utilitária
- **NextAuth** - Autenticação e gerenciamento de sessões
- **Recharts** - Biblioteca para gráficos interativos
- **Lucide React** - Ícones modernos

### Backend
- **Rust** - Linguagem de programação de alta performance
- **Actix-web 4** - Framework web assíncrono
- **SQLx 0.7** - Toolkit SQL assíncrono e type-safe
- **Bcrypt** - Hash de senhas com salt
- **Serde & Serde JSON** - Serialização/deserialização
- **UUID & Chrono** - Identificadores únicos e datas

### Database
- **PostgreSQL 16** - Banco de dados relacional
- **Migrations** - Controle de versão do schema

### DevOps
- **Docker & Docker Compose** - Containerização e orquestração
- **Multi-stage builds** - Otimização de imagens Docker

## Desenvolvimento

### Pré-requisitos

- Docker e Docker Compose
- (Opcional) Node.js 20+ e Rust 1.83+ para desenvolvimento local

### Iniciar com Docker

```bash
# Desenvolvimento (com hot-reload)
docker-compose -f docker-compose.dev.yml up --build

# Produção
docker-compose up --build
```

### Acessar os serviços

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8080
- **PostgreSQL**: localhost:5432

### API Endpoints

- `GET /` - Hello World
- `GET /health` - Health check

## Desenvolvimento Local (sem Docker)

### API (Rust)

```bash
cd api
cp .env.example .env
cargo run
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

### Database

```bash
docker-compose up postgres -d
```

## Variáveis de Ambiente

### API (.env)
```
DATABASE_URL=postgresql://finstack:finstack123@postgres:5432/finstack_db
HOST=0.0.0.0
PORT=8080
RUST_LOG=info
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
API_URL=http://api:8080
```

## 🏗️ Arquitetura

### Frontend (Next.js)
```
frontend/
├── app/                    # App Router (Next.js 15)
│   ├── page.tsx           # Dashboard principal
│   ├── login/             # Página de login
│   ├── signup/            # Página de cadastro
│   └── reports/           # Página de relatórios
├── components/            # Componentes React reutilizáveis
│   ├── auth/              # Componentes de autenticação
│   ├── dashboard/         # Componentes do dashboard
│   ├── layout/            # Componentes de layout
│   ├── reports/           # Componentes de relatórios
│   └── ui/                # Componentes de UI base
├── hooks/                 # Custom React Hooks
├── lib/                   # Utilitários e configurações
└── types/                 # Definições TypeScript
```

### Backend (Rust)
```
api/
├── src/
│   ├── main.rs           # Entry point
│   ├── handlers/         # Request handlers
│   ├── models/           # Data models
│   ├── middleware/       # Middlewares (auth, CORS)
│   ├── error.rs          # Error handling
│   └── routes.rs         # API routes
├── migrations/           # SQL migrations
└── Cargo.toml           # Dependências Rust
```

## 🔐 Fluxo de Autenticação

```
┌─────────────┐         ┌──────────────┐         ┌────────────┐
│   Browser   │────────>│   NextAuth   │────────>│  Rust API  │
│  (Frontend) │<────────│  (Middleware)│<────────│ (Backend)  │
└─────────────┘         └──────────────┘         └────────────┘
                               │                        │
                               ↓                        ↓
                        ┌──────────────┐         ┌────────────┐
                        │  JWT Session │         │ PostgreSQL │
                        └──────────────┘         └────────────┘
```

1. Usuário faz login com email/senha
2. NextAuth valida credenciais via API Rust
3. API verifica hash da senha com bcrypt
4. Se válido, retorna dados do usuário
5. NextAuth cria sessão JWT
6. Middleware protege rotas privadas

## 👥 Autores

Projeto acadêmico desenvolvido para a **Unifecaf** por:

- **Juan Pablo**
- **Gustavo Ribeiro dos Santos**
- **Guilherme Viana Santos**
- **João Vitor da Silva Batista**
- **Raul Gabriel dos Santos Moreira**

## 📄 Licença

Este é um projeto acadêmico desenvolvido para fins educacionais.


