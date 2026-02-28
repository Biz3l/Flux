import { useState } from 'react';
import { criarFluxo } from '../services/api';

const CriarFluxo = () => {
  const [nome, setNome] = useState('');
  const [etapas, setEtapas] = useState([{ mensagem: '', delay: 1 }]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const handleEtapaChange = (index, field, value) => {
    const nova = [...etapas];
    nova[index][field] = field === 'delay' ? parseInt(value) || 1 : value;
    setEtapas(nova);
  };

  const adicionarEtapa = () => {
    setEtapas([...etapas, { mensagem: '', delay: 1 }]);
  };

  const removerEtapa = (index) => {
    if (etapas.length > 1) {
      setEtapas(etapas.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem('');

    try {
      if (!nome.trim()) {
        throw new Error('Nome do fluxo é obrigatório');
      }
      if (etapas.some(e => !e.mensagem.trim())) {
        throw new Error('Todas as etapas precisam de uma mensagem');
      }

      const resultado = await criarFluxo({ nome, etapas });
      setMensagem(`✅ Fluxo "${nome}" criado com sucesso!`);
      setNome('');
      setEtapas([{ mensagem: '', delay: 1 }]);
      
      setTimeout(() => setMensagem(''), 3000);
    } catch (err) {
      setMensagem(`❌ Erro: ${err.response?.data?.erro || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>⚙️ Criar Fluxo de Mensagens</h2>
      {mensagem && (
        <div style={{
          padding: '10px',
          marginBottom: '15px',
          backgroundColor: mensagem.includes('✅') ? '#d4edda' : '#f8d7da',
          color: mensagem.includes('✅') ? '#155724' : '#721c24',
          borderRadius: '4px'
        }}>
          {mensagem}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nome do Fluxo</label>
          <input 
            type="text"
            placeholder="Ex: Fluxo de Boas-vindas" 
            value={nome} 
            onChange={e => setNome(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h3>Etapas do Fluxo</h3>
          {etapas.map((etapa, i) => (
            <div key={i} style={{
              marginBottom: '15px',
              padding: '10px',
              backgroundColor: '#f9f9f9',
              borderRadius: '4px',
              border: '1px solid #eee'
            }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Etapa {i + 1}
              </label>
              <textarea
                placeholder="Digite a mensagem..."
                value={etapa.mensagem}
                onChange={e => handleEtapaChange(i, 'mensagem', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  minHeight: '80px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  marginBottom: '8px',
                  boxSizing: 'border-box',
                  fontFamily: 'Arial'
                }}
              />
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label>
                  Delay (minutos):
                  <input
                    type="number"
                    min="0"
                    value={etapa.delay}
                    onChange={e => handleEtapaChange(i, 'delay', e.target.value)}
                    style={{
                      width: '60px',
                      padding: '5px',
                      marginLeft: '5px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  />
                </label>
                {etapas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removerEtapa(i)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    ❌ Remover
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={adicionarEtapa}
            style={{
              padding: '10px 15px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ➕ Adicionar Etapa
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Criando...' : '✅ Criar Fluxo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CriarFluxo;