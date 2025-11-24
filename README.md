# Finstack

Sistema de gestão financeira com frontend Next.js e API em Rust.

## Estrutura do Projeto

```
stackfindover/
├── frontend/          # Next.js Application
├── api/              # Rust API (Actix-web)
└── docker-compose.yml
```

## Tecnologias

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Rust, Actix-web, SQLx
- **Database**: PostgreSQL 16
- **DevOps**: Docker, Docker Compose

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
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
