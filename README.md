# 🚀 Flux - Sistema de Automação de Campanhas WhatsApp

![Node.js](https://img.shields.io/badge/Node.js-18-green)
![React](https://img.shields.io/badge/React-18-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)
![Express](https://img.shields.io/badge/Express-4-000000)
![License](https://img.shields.io/badge/License-MIT-green)

> 💬 **Flux** é uma plataforma robusta e escalável para **automação de campanhas e fluxos de atendimento via WhatsApp**. Ideal para empresas que desejam automatizar comunicações em massa, gerenciar contatos e orquestrar fluxos de conversação complexos.

---

## 📋 Índice

- [Características](#-características)
- [Requisitos](#-requisitos)
- [Instalação Local](#-instalação-local)
- [Com Docker](#-com-docker)
- [Documentação da API](#-documentação-da-api)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Configuração](#-configuração)
- [Deploy](#-deploy)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## ✨ Características

✅ **Gestão de Contatos** – Importar, armazenar e organizar contatos via CSV  
✅ **Campanhas de Mensagens** – Envio em massa com delays configuráveis  
✅ **Fluxos Inteligentes** – Orquestração de conversas com lógica condicional  
✅ **Integração WhatsApp** – Via WPPConnect para automação nativa  
✅ **Workers Assíncronos** – Processamento em background para envios e fluxos  
✅ **Backend RESTful** – API completa com Express + Prisma ORM  
✅ **Frontend Moderno** – React com componentes responsivos  
✅ **Dockerizado** – Deploy simplificado com docker-compose  

---

## 🛠 Requisitos

### Desenvolvimento Local
- **Node.js** v18+ ([download](https://nodejs.org/))
- **npm** ou **yarn**
- **PostgreSQL** v15+ (ou Docker)
- **Git**

### Com Docker
- **Docker** ([download](https://www.docker.com/products/docker-desktop))
- **docker-compose** (incluído no Docker Desktop)

---

## 💻 Instalação Local

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/flux.git
cd flux
```

### 2. Configurar Backend

```bash
cd backend
npm install

# Copiar arquivo de ambiente
# Unix/macOS
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env

# Editar .env com suas credenciais
# DATABASE_URL=postgresql://user:password@localhost:5432/flux
# 

# Executar migrações
npx prisma migrate dev
npx prisma generate

# Iniciar servidor
npm start

# Rodar com workers (PowerShell)
$env:WORKER_MODE = 'true'
npm start

# Rodar com workers (bash / macOS / WSL)
export WORKER_MODE=true
npm start

# Servidor rodará em http://localhost:3001
```

### 3. Configurar Frontend

```bash
cd ../frontend
npm install

# Copiar arquivo de ambiente
# Unix/macOS
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env

# REACT_APP_API_URL=http://localhost:3001

# Iniciar aplicação
npm start
# Aplicação abrirá em http://localhost:3000
```

---

## 🐳 Com Docker

### Início Rápido

```bash
# Na raiz do projeto
docker-compose up -d

# Aguarde ~30 segundos para inicialização completa
# Backend: http://localhost:3001
# Frontend: http://localhost:3000
# PostgreSQL: localhost:5432
```

### Parar os serviços

```bash
docker-compose down
```

### Ver logs

```bash
docker-compose logs -f backend    # Backend
docker-compose logs -f frontend   # Frontend
docker-compose logs -f postgres   # Banco de dados
docker-compose logs -f            # Todos
```

### Resetar dados

```bash
docker-compose down -v            # Remove volumes (dados)
docker-compose up -d              # Reinicia tudo
```

---

## 📡 Documentação da API

### Base URL
- **Local:** `http://localhost:3001/api`
- **Docker:** `http://localhost:3001/api`

### Endpoints Principais

#### Contatos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/contatos` | Listar todos os contatos |
| `GET` | `/contatos/:id` | Obter contato por ID |
| `POST` | `/contatos/import` | Importar contatos via CSV |
| `PUT` | `/contatos/:id` | Atualizar contato |
| `DELETE` | `/contatos/:id` | Deletar contato |

**Exemplo: Importar contato**
```bash
curl -X POST http://localhost:3001/api/contatos/import \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Bernardo Silva",
    "telefone": "31980219062"
  }'
```

#### Campanhas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/campanhas` | Listar campanhas |
| `POST` | `/campanhas` | Criar campanha |
| `POST` | `/campanhas/:id/enviar` | Enviar para contatos |
| `PUT` | `/campanhas/:id` | Atualizar campanha |
| `DELETE` | `/campanhas/:id` | Deletar campanha |

**Exemplo: Criar campanha**
```bash
curl -X POST http://localhost:3001/api/campanhas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Promoção de Verão",
    "mensagem": "Ótimas promoções esperando você!",
    "delayMin": 3,
    "delayMax": 8
  }'
```

#### Fluxos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/fluxos` | Listar fluxos |
| `POST` | `/fluxos` | Criar fluxo |
| `POST` | `/fluxos/:id/execute` | Executar fluxo |
| `PUT` | `/fluxos/:id` | Atualizar fluxo |
| `DELETE` | `/fluxos/:id` | Deletar fluxo |

---

## 📁 Estrutura do Projeto

```
flux/
├── backend/
│   ├── src/
│   │   ├── api/                    # Rotas e controllers
│   │   │   ├── contatos.js
│   │   │   ├── campanhas.js
│   │   │   └── fluxos.js
│   │   ├── services/               # Lógica de negócio
│   │   │   ├── contatosService.js
│   │   │   ├── campanhasService.js
│   │   │   └── fluxosService.js
│   │   ├── repositories/           # Camada de dados
│   │   │   ├── contatosRepo.js
│   │   │   ├── campanhasRepo.js
│   │   │   └── fluxosRepo.js
│   │   ├── workers/                # Processamento assíncrono
│   │   │   ├── workerEnvio.js
│   │   │   └── workerFluxo.js
│   │   ├── models/                 # Schemas do banco
│   │   │   ├── Contato.js
│   │   │   ├── Campanha.js
│   │   │   └── Fluxo.js
│   │   ├── config/                 # Configurações
│   │   │   ├── database.js
│   │   │   └── wppconnect.js
│   │   ├── utils/                  # Funções utilitárias
│   │   │   └── delays.js
│   │   └── app.js                  # Entry point
│   ├── prisma/
│   │   ├── schema.prisma          # Schema ORM
│   │   └── migrations/            # Migrações do banco
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/            # Componentes React
│   │   │   ├── ImportCSV.jsx
│   │   │   ├── CriarCampanha.jsx
│   │   │   └── CriarFluxo.jsx
│   │   ├── pages/                 # Páginas
│   │   │   └── App.jsx
│   │   ├── services/              # Integrações com API
│   │   │   └── api.js
│   │   ├── index.js               # Entry point
│   │   └── index.css              # Estilos globais
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
│
├── docker-compose.yml             # Orquestração Docker
├── .gitignore
└── README.md
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

#### Backend (`.env`)

```env
# Servidor
PORT=3001
NODE_ENV=development

# Banco de dados
DATABASE_URL=postgresql://postgres:password@localhost:5432/flux

# CORS
CORS_ORIGIN=*

# WPPConnect
WPPCONNECT_URL=http://localhost:8080
WPPCONNECT_TOKEN=seu_token_aqui

# Workers (controlam a inicialização dos processos em background)
# Defina `WORKER_MODE` como 'true' para iniciar todos os workers
# ou como 'fluxo' para iniciar somente o worker de fluxos.
WORKER_MODE=true

# Controle de concorrência/limites pode ser implementado via variáveis
# customizadas no código (ex: WORKER_CONCURRENCY) se necessário.
```

#### Frontend (`.env`)

```env
# API Backend
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
```

---

## 🚀 Deploy

### Deploy com Docker (Recomendado)

1. **Configurar variáveis no `.env`** para produção
2. **Build e push** das imagens:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
docker-compose -f docker-compose.yml -f docker-compose.prod.yml push
```

3. **Deploy em servidor**:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Deploy em Vercel/Netlify (Frontend)

```bash
npm run build
vercel --prod
```

### Deploy em Heroku/Railway (Backend)

```bash
heroku container:push web
heroku container:release web
```

---

## 🔧 Troubleshooting

### Erro: "Porta 3001 já em uso"

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3001
kill -9 <PID>
```

### Erro: "Cannot connect to database"

```bash
# Verificar conexão
psql postgresql://postgres:password@localhost:5432/flux

# Executar migrações
cd backend
npx prisma migrate dev
```

### Frontend não conecta ao backend

- Verificar se `REACT_APP_API_URL` está correto em `.env`
- Verificar se CORS está habilitado no backend
- Usar `npm start` para rebuild

---

## 📚 Recursos Adicionais

- [Documentação Prisma](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [WPPConnect](https://github.com/wppconnect-team/wppconnect)

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 👨‍💻 Autor

- GitHub: [@biz3l](https://github.com/biz3l)
- Email: contato.goalves@gmail.com