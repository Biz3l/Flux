import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // URL do backend
});

export const importarContato = (contato) => api.post('/contatos/import', contato);
export const listarContatos = () => api.get('/contatos');
export const limparContatos = () => api.delete('/contatos');

export const criarCampanha = (campanha) => api.post('/campanhas', campanha);
export const listarCampanhas = () => api.get('/campanhas');
export const enviarCampanha = (id, contatosIds) => api.post(`/campanhas/${id}/enviar`, { contatosIds });

export const criarFluxo = (fluxo) => api.post('/fluxos', fluxo);
export const listarFluxos = () => api.get('/fluxos');
export const adicionarListaAoFluxo = (fluxoId, contatosIds) => api.post(`/fluxos/${fluxoId}/adicionar`, { contatosIds });