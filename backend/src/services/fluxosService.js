// Service - Lógica de negócio para fluxos
const fluxosRepo = require('../repositories/fluxosRepo');
const prisma = require('../config/database');

const getAll = async () => {
  return await fluxosRepo.findAll();
};

const getById = async (id) => {
  return await fluxosRepo.findById(parseInt(id));
};

const create = async (data) => {
  const { nome, etapas } = data;
  if (!nome || !etapas || etapas.length === 0) {
    throw new Error('Nome e pelo menos uma etapa são obrigatórios');
  }

  // Criar fluxo principal
  const novoFluxo = await prisma.fluxo.create({
    data: {
      nome,
      etapas: {
        createMany: {
          data: etapas.map((e, idx) => ({
            ordem: idx,
            mensagem: e.mensagem,
            delayMin: e.delay || 1 // em minutos
          }))
        }
      }
    },
    include: { etapas: true }
  });

  return novoFluxo;
};

const update = async (id, data) => {
  const { nome, etapas } = data;
  
  // Atualizar nome do fluxo
  const fluxoAtualizado = await prisma.fluxo.update({
    where: { id: parseInt(id) },
    data: { nome },
    include: { etapas: true }
  });

  // Se enviar novas etapas, deletar antigas e criar novas
  if (etapas && etapas.length > 0) {
    await prisma.fluxoEtapa.deleteMany({ where: { fluxoId: parseInt(id) } });
    
    await prisma.fluxoEtapa.createMany({
      data: etapas.map((e, idx) => ({
        fluxoId: parseInt(id),
        ordem: idx,
        mensagem: e.mensagem,
        delayMin: e.delay || 1
      }))
    });
  }

  return fluxoAtualizado;
};

const deleteFluxo = async (id) => {
  // Deletar execuções primeiro (FK constraint)
  await prisma.execucaoFluxo.deleteMany({ where: { fluxoId: parseInt(id) } });
  
  // Deletar etapas
  await prisma.fluxoEtapa.deleteMany({ where: { fluxoId: parseInt(id) } });
  
  // Deletar fluxo
  return await prisma.fluxo.delete({ where: { id: parseInt(id) } });
};

const execute = async (fluxoId, contatosIds) => {
  if (!contatosIds || contatosIds.length === 0) {
    throw new Error('Nenhum contato selecionado');
  }

  const fluxoId_int = parseInt(fluxoId);
  
  // Validar que fluxo existe e buscar suas etapas
  const fluxo = await prisma.fluxo.findUnique({
    where: { id: fluxoId_int },
    include: { etapas: { orderBy: { ordem: 'asc' } } }
  });
  
  if (!fluxo) {
    throw new Error('Fluxo não encontrado');
  }

  // Para cada contato, criar registro de execução de fluxo
  const execucoes = await prisma.execucaoFluxo.createMany({
    data: contatosIds.map(contatoId => ({
      contatoId: parseInt(contatoId),
      fluxoId: fluxoId_int,
      etapaAtual: 0,
      finalizado: false
    }))
  });

  return {
    mensagem: `Fluxo adicionado para ${contatosIds.length} contato(s)`,
    execucoes
  };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteFluxo,
  execute
};
