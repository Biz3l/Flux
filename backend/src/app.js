const express = require('express');
const cors = require('cors');
const contatosRoutes = require('./api/contatos');
const campanhasRoutes = require('./api/campanhas');
const fluxosRoutes = require('./api/fluxos');

// Importar workers (inicializa automaticamente se WORKER_MODE estiver ativo)
require('./workers/workerEnvio');
require('./workers/workerFluxo');

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

// rotas do sistema
app.use('/api/contatos', contatosRoutes);
app.use('/api/campanhas', campanhasRoutes);
app.use('/api/fluxos', fluxosRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', workers: process.env.WORKER_MODE });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor rodando na porta ${PORT}`));