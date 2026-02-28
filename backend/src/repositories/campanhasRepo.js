// Repository - Consultas ao banco de dados para campanhas

const { randomInt } = require('../utils/delays');
const prisma = require('../config/database');

const criar = async (data) => {
  return await prisma.campanha.create({
    data,
  });
};

const listar = async () => {
  return await prisma.campanha.findMany({
    orderBy: { criacao: 'desc' }
  });
};


const adicionarFila = async (campanhaId, contatos, campanha) => {
  const rows = contatos.map(c => {
    // ✅ Calcula delay aleatório para cada contato
    const delayMs = randomInt(
      campanha.delayMin,
      campanha.delayMax
    ) * 1000;
    
    const agora = new Date();
    const agendadoPara = new Date(agora.getTime() + delayMs);
    
    return {
      campanhaId,
      contatoId: c.id,
      agendadoPara
    };
  });

  return await prisma.filaEnvio.createMany({
    data: rows
  });
};

module.exports = {
  criar,
  listar,
  adicionarFila
};