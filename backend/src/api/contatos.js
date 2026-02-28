// API - Rotas e controllers para gerenciar contatos
// backend/src/api/contatos.js
const express = require('express');
const router = express.Router();
const contatosService = require('../services/contatosService');

router.post('/import', async (req, res) => {
  try { 
    const { nome, telefone } = req.body;
    if (!nome || !telefone) {
        return res.status(400).json({ erro: 'Nome e telefone são obrigatórios' });
    }
    const contato = await contatosService.importarContato(nome, telefone);
    res.json({ sucesso: true, message: contato });
} catch(e) {
  return res.status(400).json({ erro: e.message} );
}
});

router.delete("/", async (req, res) => {
  try {
    const limpo = await contatosService.limparContatos();

    res.json({sucesso: true, message: limpo.count + ` Contatos limpos com sucesso!`});

  } catch(e) {

    return res.status(400).json({ erro: e.message });

  }
})

router.get('/', async (req, res) => {
    const contatos = await contatosService.listarContatos();
    res.json(contatos);
});

module.exports = router;

