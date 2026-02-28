// API - Rotas e controllers para gerenciar fluxos
const express = require('express');
const router = express.Router();
const fluxosService = require('../services/fluxosService');

// rotas básicas de CRUD
router.get('/', async (req, res) => {
  try {
    const fluxos = await fluxosService.getAll();
    res.json(fluxos);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ erro: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const fluxo = await fluxosService.getById(req.params.id);
    res.json(fluxo);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const novoFluxo = await fluxosService.create(data);
    res.json({ sucesso: true, fluxo: novoFluxo });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = req.body;
    const fluxo = await fluxosService.update(req.params.id, data);
    res.json({ sucesso: true, fluxo });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await fluxosService.delete(req.params.id);
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Rota para adicionar contatos ao fluxo (principal do desafio)
router.post('/:id/adicionar', async (req, res) => {
  try {
    const fluxoId = req.params.id;
    const { contatosIds } = req.body;
    
    if (!contatosIds || !Array.isArray(contatosIds) || contatosIds.length === 0) {
      return res.status(400).json({ erro: 'contatosIds deve ser um array não vazio' });
    }

    const resultado = await fluxosService.execute(fluxoId, contatosIds);
    res.json({ sucesso: true, ...resultado });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

router.post('/:id/execute', async (req, res) => {
  try {
    const { contatosIds } = req.body;
    const resultado = await fluxosService.execute(req.params.id, contatosIds);
    res.json({ sucesso: true, ...resultado });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

module.exports = router;
