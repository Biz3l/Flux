// Worker - Processos assíncronos de envio de mensagens
const prisma = require('../config/database');
const axios = require('axios');
const { randomInt } = require('../utils/delays');
const { createWppConnect, getClient } = require('../config/wppconnect');
require('dotenv').config();

const WORKER_INTERVAL = 5000;

let running = false;

const enviarMensagem = async (telefone, mensagem) => {
  try {
    const client = getClient();
    client.sendText(
      `55${telefone}@c.us`,
      mensagem
    );

    console.log(`Mensagem enviada com sucesso para ${telefone}`);

  } catch (e) {
    console.log("Erro: " + e.message);
  };
};

const processarFila = async () => {
  if (running) return;
  running = true;

  try {
    const fila = await prisma.filaEnvio.findMany({
      where: {
        enviado: false,
        agendadoPara: { lte: new Date() }  // Apenas os prontos para enviar
      },
      include: {
        contato: true,
        campanha: true
      },
      take: 10
    });

    
    for (const item of fila) {
      try {
        console.log(
          `Enviando mensagem para ${item.contato.telefone}`
        );

        await enviarMensagem(
          item.contato.telefone,
          item.campanha.mensagem
        );

        await prisma.filaEnvio.update({
          where: { id: item.id },
          data: { enviado: true }
        });

      } catch (err) {
        console.error(`Erro no item ${item.id}:`, err.message);
      }
    }

  } finally {
    running = false;
  }
};

const startWorker = async () => {
  console.log('[WORKER ENVIO] Iniciando...');

  try {
    await createWppConnect(process.env.WPP_CONNECTNUMBER);
    console.log('[WORKER ENVIO] ✅ WhatsApp conectado');
  } catch (err) {
    console.warn('[WORKER ENVIO] ⚠️ Não conseguiu conectar WPPConnect:', err.message);
    console.warn('[WORKER ENVIO] Continuando com modo mock...');
  }

  console.log('[WORKER ENVIO] Pronto. Processando fila a cada 5 segundos...');

  setInterval(processarFila, WORKER_INTERVAL);
  
  // Processar imediatamente na primeira execução
  processarFila();
};

// ✅ Reconhece WORKER_MODE=true e WORKER_MODE=envio
if (process.env.WORKER_MODE === 'true' || process.env.WORKER_MODE === 'envio') {
  startWorker();
}

module.exports = {
  processarFila,
  startWorker
};