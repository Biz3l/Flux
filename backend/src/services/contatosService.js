// Service - Lógica de negócio para contatos
const contatosRepo = require('../repositories/contatosRepo');
const prisma = require("../config/database");


const importarContato = async (nome, telefone) => {
  if (!nome || !telefone) {
    throw new Error("Não há nome ou telefone!!!");
  }

  // Normaliza telefone: remove espaços, hífens, parênteses e +
  let telefoneLimpo = telefone.replace(/[\s\-()]+/g, '');

  // Remove código do país
  if (telefoneLimpo.startsWith('+55')) {
    telefoneLimpo = telefoneLimpo.substring(3);
  } else if (telefoneLimpo.startsWith('55') && telefoneLimpo.length > 11) {
    telefoneLimpo = telefoneLimpo.substring(2);
  }

  // Remove "9" extra do WhatsApp apenas se o número tiver 11 dígitos
  // e o 9 estiver logo após o DDD
  if (/^\d{11}$/.test(telefoneLimpo) && telefoneLimpo[2] === '9') {
    telefoneLimpo = telefoneLimpo[0] + telefoneLimpo[1] + telefoneLimpo.substring(3);
  }

  // Verifica se o telefone agora tem 10 dígitos
  if (!/^\d{10}$/.test(telefoneLimpo)) {
    throw new Error("Número inválido! Use formato: 11912345678 ou (11) 1234-5678");
  }

  // Checa duplicado
  const numero = await prisma.contato.findUnique({
    where: { telefone: telefoneLimpo }
  });
  if (numero) {
    throw new Error("Esse número já existe!!");
  }

  try {
    const novoContato = await contatosRepo.add({ nome, telefone: telefoneLimpo });
    return novoContato;
  } catch (err) {
    console.error("Erro ao importar contato: ", err.message);
    throw err;
  }
};
const listarContatos = async () => {
  return await contatosRepo.getAll();
};

const limparContatos = async () => {
  return await contatosRepo.clearAll();
}

module.exports = {
  importarContato,
  listarContatos,
  limparContatos,
}