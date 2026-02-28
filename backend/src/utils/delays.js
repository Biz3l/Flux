// Utils - Funções auxiliares de delay e timing

// Gera número aleatório entre min e max (inteiros)
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = {
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  randomDelay: (min, max) => {
    const ms = Math.random() * (max - min) + min;
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  randomInt,
  delayBetweenMessages: async (count) => {
    // Aguardar tempo entre mensagens para evitar bloqueios
  },
  exponentialBackoff: async (attempt) => {
    // Retry com backoff exponencial
  }
};
