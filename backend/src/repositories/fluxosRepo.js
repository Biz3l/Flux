// Repository - Consultas ao banco de dados para fluxos
const prisma = require('../config/database');

const findAll = async () => {
  return await prisma.fluxo.findMany({
    include: { etapas: { orderBy: { ordem: 'asc' } } },
    orderBy: { criadoEm: 'desc' }
  });
};

const findById = async (id) => {
  return await prisma.fluxo.findUnique({
    where: { id },
    include: {
      etapas: { orderBy: { ordem: 'asc' } },
      execucaoFluxos: { include: { contato: true } }
    }
  });
};

const create = async (data) => {
  return await prisma.fluxo.create({
    data,
    include: { etapas: true }
  });
};

const update = async (id, data) => {
  return await prisma.fluxo.update({
    where: { id },
    data,
    include: { etapas: true }
  });
};

const deleteFluxo = async (id) => {
  return await prisma.fluxo.delete({
    where: { id }
  });
};

// Buscar execuções de fluxo pendentes
const findExecucoesPendentes = async (limit = 10) => {
  return await prisma.execucaoFluxo.findMany({
    where: { finalizado: false },
    include: {
      contato: true,
      fluxo: { include: { etapas: { orderBy: { ordem: 'asc' } } } }
    },
    take: limit
  });
};

// Atualizar status de execução de fluxo
const atualizarExecucao = async (id, data) => {
  return await prisma.execucaoFluxo.update({
    where: { id },
    data
  });
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  delete: deleteFluxo,
  findExecucoesPendentes,
  atualizarExecucao
};
