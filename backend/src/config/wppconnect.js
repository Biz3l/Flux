const wppconnect = require('@wppconnect-team/wppconnect');

let client = null;

const createWppConnect = async (number) => {
  client = await wppconnect.create({
    phoneNumber: number,
    catchLinkCode: (str) => console.log('Code: ' + str),
  });

  console.log('WhatsApp conectado!');
  return client;
};

const getClient = () => {
  if (!client) {
    throw new Error('WPPConnect não inicializado');
  }
  return client;
};

module.exports = {
  createWppConnect,
  getClient,
};