// API - Rotas e controllers para gerenciar campanhas
const express = require('express');
const router = express.Router();
const campanhasService = require("../services/campanhasService");
const contatosService = require("../services/contatosService");
const prisma = require("../config/database");

// Criar nova campanha
router.post('/', async (req, res) => {
  try {
    const { nome, mensagem, delayMin = 5, delayMax = 10 } = req.body;
    const campanha = await campanhasService.criarCampanha({ nome, mensagem, delayMin, delayMax });
    res.json({ sucesso: true, campanha });
  } catch (err) {
    res.status(400).json({ sucesso: false, erro: err.message });
  }
});

// Listar todas campanhas
router.get('/', async (req, res) => {
  try {
    const campanhas = await campanhasService.listarCampanhas();
    res.json({ sucesso: true, campanhas });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
});

// Adicionar contatos à fila de envio de uma campanha
router.post('/:id/enviar', async (req, res) => {
  try {
    const campanhaId = parseInt(req.params.id);
    const { contatosIds } = req.body; // lista de IDs de contatos

    if (!contatosIds || !Array.isArray(contatosIds) || contatosIds.length === 0) {
      return res.status(400).json({ sucesso: false, erro: 'Nenhum contato selecionado' });
    }

    // ✅ Buscar contatos no banco de forma eficiente
    const contatos = await prisma.contato.findMany({
      where: {
        id: { in: contatosIds }
      }
    });

    if (contatos.length === 0) {
      return res.status(400).json({ sucesso: false, erro: 'Nenhum contato encontrado' });
    }

    // Enviar campanha
    const resultado = await campanhasService.enviarCampanha(campanhaId, contatos);

    res.json({ 
      sucesso: true, 
      mensagem: `Campanha enfileirada para ${contatos.length} contato(s)`,
      contatosProcessados: contatos.length
    });
  } catch (err) {
    console.error('Erro ao enviar campanha:', err);
    res.status(500).json({ sucesso: false, erro: err.message });
  }
});

module.exports = router;