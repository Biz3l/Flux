// workerFluxo.js - Processos assíncronos de execução de fluxos

const prisma = require('../config/database');
const { getClient } = require('../config/wppconnect');

const WORKER_INTERVAL = 10000; // checa a cada 10s

// -----------------------------
// Função de envio de mensagem
// -----------------------------
const enviarMensagem = async (telefone, mensagem) => {
  try {
    const client = getClient();
    const idWhatsApp = `55${telefone}@c.us`;
    await client.sendText(idWhatsApp, mensagem);
    console.log(`[FLUXO] Mensagem enviada para ${telefone}`);
  } catch (err) {
    console.error(`[FLUXO] Falha ao enviar para ${telefone}:`, err.message);
    throw err;
  }
};

// -----------------------------
// Função que processa cada execução de fluxo
// -----------------------------
const processarExecucao = async (exec) => {
  if (!exec.fluxo) {
    console.warn(`[FLUXO] Execução ${exec.id} sem fluxo. Finalizando.`);
    await prisma.execucaoFluxo.update({
      where: { id: exec.id },
      data: { finalizado: true }
    });
    return;
  }

  const etapas = exec.fluxo.etapas || [];
  if (!etapas.length) {
    console.warn(`[FLUXO] Fluxo ${exec.fluxo.id} sem etapas. Finalizando execução ${exec.id}.`);
    await prisma.execucaoFluxo.update({
      where: { id: exec.id },
      data: { finalizado: true }
    });
    return;
  }

  if (!exec.contato) {
    console.warn(`[FLUXO] Execução ${exec.id} sem contato. Finalizando.`);
    await prisma.execucaoFluxo.update({
      where: { id: exec.id },
      data: { finalizado: true }
    });
    return;
  }

  const etapaAtual = exec.etapaAtual;
  if (etapaAtual >= etapas.length) {
    await prisma.execucaoFluxo.update({
      where: { id: exec.id },
      data: { finalizado: true }
    });
    console.log(`[FLUXO] Execução ${exec.id} finalizada (todas etapas concluídas).`);
    return;
  }

  const etapa = etapas[etapaAtual];
  const agora = new Date();
  const tempoDecorridoMs = agora.getTime() - new Date(exec.iniciadoEm).getTime();
  const tempoNecessarioMs = etapas
    .slice(0, etapaAtual)
    .reduce((acc, e) => acc + e.delayMin * 60 * 1000, 0);

  if (etapaAtual === 0 || tempoDecorridoMs >= tempoNecessarioMs) {
    try {
      await enviarMensagem(exec.contato.telefone, etapa.mensagem);
      console.log(`[FLUXO] Etapa ${etapaAtual} enviada ao contato ${exec.contato.telefone}`);

      await prisma.execucaoFluxo.update({
        where: { id: exec.id },
        data: { etapaAtual: etapaAtual + 1 }
      });
    } catch (err) {
      console.error(`[FLUXO] Erro na etapa ${etapa.ordem} da execução ${exec.id}:`, err.message);
    }
  }
};

// -----------------------------
// Loop do worker - processa fluxos ativos
// -----------------------------
const processarFluxos = async () => {
  try {
    const execucoes = await prisma.execucaoFluxo.findMany({
      where: { finalizado: false },
      include: {
        contato: true,
        fluxo: { include: { etapas: { orderBy: { ordem: 'asc' } } } }
      },
      take: 10
    });

    for (const exec of execucoes) {
      await processarExecucao(exec);
    }
  } catch (err) {
    console.error('[FLUXO] Erro ao processar execuções:', err.message);
  }
};

// -----------------------------
// Inicializa worker
// -----------------------------
const startWorkerFluxo = () => {
  console.log(`[FLUXO] Worker de fluxos iniciado (interval: ${WORKER_INTERVAL}ms)`);
  setInterval(processarFluxos, WORKER_INTERVAL);
  processarFluxos().catch(err => console.error('[FLUXO] Erro na primeira execução:', err));
};

// Inicia worker se WORKER_MODE estiver ativo ou 'fluxo'
if (process.env.WORKER_MODE === 'true' || process.env.WORKER_MODE === 'fluxo') {
  startWorkerFluxo();
}

module.exports = {
  processarFluxos,
  startWorkerFluxo
};