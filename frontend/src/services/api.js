import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL}/api`
    : '/api',
});

// Contatos
export const importarContato = (contato) => api.post('/contatos/import', contato);
export const listarContatos = () => api.get('/contatos');
export const limparContatos = () => api.delete('/contatos')

// Campanhas
export const criarCampanha = (campanha) => api.post('/campanhas', campanha);
export const listarCampanhas = () => api.get('/campanhas');
export const enviarCampanha = (id, contatosIds) => api.post(`/campanhas/${id}/enviar`, { contatosIds });

// Fluxos
export const criarFluxo = (fluxo) => api.post('/fluxos', fluxo);
export const listarFluxos = () => api.get('/fluxos');
export const obterFluxo = (id) => api.get(`/fluxos/${id}`);
export const atualizarFluxo = (id, fluxo) => api.put(`/fluxos/${id}`, fluxo);
export const deletarFluxo = (id) => api.delete(`/fluxos/${id}`);

// Adicionar contatos ao fluxo (principal funcionalidade)
export const adicionarAoFluxo = (fluxoId, contatosIds) => 
  api.post(`/fluxos/${fluxoId}/adicionar`, { contatosIds });

// Alias para compatibilidade
export const adicionarListaAoFluxo = (fluxoId, contatosIds) => 
  api.post(`/fluxos/${fluxoId}/adicionar`, { contatosIds });