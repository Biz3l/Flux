// Service - Lógica de negócio para campanhas

const campanhasRepo = require('../repositories/campanhasRepo');
const prisma  = require('../config/database');

const criarCampanha = async ({ nome, mensagem, delayMin, delayMax }) => {
  if (!nome || !mensagem) throw new Error('Nome e mensagem são obrigatórios');

  return await campanhasRepo.criar({ nome, mensagem, delayMin, delayMax });
};

const listarCampanhas = async () => {
  return await campanhasRepo.listar();
};

// Recebe uma campanha e uma lista de contatos
const enviarCampanha = async (campanhaId, contatos) => {
  if (!contatos || contatos.length === 0) throw new Error('Nenhum contato selecionado');
  
  // ✅ Buscar campanha para ter delayMin/Max
  const campanha = await campanhasRepo.listar().then(todas => 
    todas.find(c => c.id === campanhaId)
  );
  
  if (!campanha) throw new Error('Campanha não encontrada');
  
  return await campanhasRepo.adicionarFila(campanhaId, contatos, campanha);
};

module.exports = {
  criarCampanha,
  listarCampanhas,
  enviarCampanha
};
