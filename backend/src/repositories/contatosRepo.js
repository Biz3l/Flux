// Repository - Consultas ao banco de dados para contatos
const prisma = require("../config/database");


const add = async (contato) => {
  return await prisma.contato.create({
    data: {
      nome: contato.nome,
      telefone: contato.telefone,
    },
  });
};

const getAll = async () => {
  return await prisma.contato.findMany();
};

const clearAll = async () => {
  // Primeiro limpa execuções de fluxos
  await prisma.execucaoFluxo.deleteMany();

  // Depois limpa fila de envios
  await prisma.filaEnvio.deleteMany();

  // Agora pode limpar contatos
  return await prisma.contato.deleteMany();
}


module.exports = {
  getAll,
  add,
  clearAll,
};
