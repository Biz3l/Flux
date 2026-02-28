import { useState, useEffect } from 'react';
import { criarCampanha, listarCampanhas, enviarCampanha, listarContatos } from '../services/api';

export default function CriarCampanha() {
  const [nome, setNome] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [delayMin, setDelayMin] = useState(2);
  const [delayMax, setDelayMax] = useState(5);
  
  // Estados para envio
  const [campanhas, setCampanhas] = useState([]);
  const [contatos, setContatos] = useState([]);
  const [campanhaEscolhida, setCampanhaEscolhida] = useState('');
  const [contatosSelecionados, setContatosSelecionados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagemStatus, setMensagemStatus] = useState('');

  // Carregar campanhas e contatos ao montar o componente
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const campanhasRes = await listarCampanhas();
      setCampanhas(campanhasRes.data.campanhas || []);
      
      const contatosRes = await listarContatos();
      setContatos(Array.isArray(contatosRes.data) ? contatosRes.data : []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  };

  const handleCriarCampanha = async (e) => {
    e.preventDefault();
    if (!nome || !mensagem) {
      setMensagemStatus('❌ Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      await criarCampanha({ 
        nome, 
        mensagem, 
        delayMin: parseInt(delayMin), 
        delayMax: parseInt(delayMax) 
      });
      setMensagemStatus('✅ Campanha criada com sucesso!');
      setNome('');
      setMensagem('');
      setDelayMin(2);
      setDelayMax(5);
      
      // Recarregar campanhas
      setTimeout(() => carregarDados(), 500);
    } catch (err) {
      setMensagemStatus('❌ Erro ao criar campanha: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarCampanha = async (e) => {
    e.preventDefault();
    
    if (!campanhaEscolhida) {
      setMensagemStatus('❌ Escolha uma campanha');
      return;
    }
    
    if (contatosSelecionados.length === 0) {
      setMensagemStatus('❌ Selecione pelo menos um contato');
      return;
    }

    setLoading(true);
    try {
      await enviarCampanha(parseInt(campanhaEscolhida), contatosSelecionados);
      setMensagemStatus(`✅ Campanha enfileirada para ${contatosSelecionados.length} contato(s)!`);
      setContatosSelecionados([]);
      setCampanhaEscolhida('');
    } catch (err) {
      setMensagemStatus('❌ Erro ao enviar campanha: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleContatoSelecionado = (idContato) => {
    if (contatosSelecionados.includes(idContato)) {
      setContatosSelecionados(contatosSelecionados.filter(id => id !== idContato));
    } else {
      setContatosSelecionados([...contatosSelecionados, idContato]);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px' }}>
      <h2>📢 Gerenciar Campanhas</h2>
      
      {mensagemStatus && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: mensagemStatus.includes('✅') ? '#d4edda' : '#f8d7da',
          color: mensagemStatus.includes('✅') ? '#155724' : '#721c24',
          borderRadius: '4px',
          border: '1px solid',
          borderColor: mensagemStatus.includes('✅') ? '#c3e6cb' : '#f5c6cb'
        }}>
          {mensagemStatus}
        </div>
      )}

      {/* SEÇÃO 1: CRIAR NOVA CAMPANHA */}
      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: '2px solid #e0e0e0'
      }}>
        <h3>Criar Nova Campanha</h3>
        <form onSubmit={handleCriarCampanha} style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px'
        }}>
          <input
            placeholder="Nome da campanha"
            value={nome}
            onChange={e => setNome(e.target.value)}
            style={{
              gridColumn: '1 / -1',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <textarea
            placeholder="Mensagem a enviar"
            value={mensagem}
            onChange={e => setMensagem(e.target.value)}
            style={{
              gridColumn: '1 / -1',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              minHeight: '80px',
              fontFamily: 'Arial'
            }}
          />
          <div>
            <label>Delay Mín (segundos):</label>
            <input
              type="number"
              min="0"
              value={delayMin}
              onChange={e => setDelayMin(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>
          <div>
            <label>Delay Máx (segundos):</label>
            <input
              type="number"
              min="0"
              value={delayMax}
              onChange={e => setDelayMax(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              gridColumn: '1 / -1',
              padding: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? '⏳ Criando...' : '✅ Criar Campanha'}
          </button>
        </form>
      </div>

      {/* SEÇÃO 2: ENVIAR CAMPANHA */}
      <div style={{
        backgroundColor: '#f0f8ff',
        padding: '20px',
        borderRadius: '8px',
        border: '2px solid #87ceeb'
      }}>
        <h3>Enviar Campanha para Contatos</h3>

        {campanhas.length === 0 ? (
          <p style={{ color: '#666' }}>Nenhuma campanha criada ainda</p>
        ) : (
          <form onSubmit={handleEnviarCampanha}>
            {/* Seleção de Campanha */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Escolha a Campanha:
              </label>
              <select
                value={campanhaEscolhida}
                onChange={e => setCampanhaEscolhida(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              >
                <option value="">-- Selecione uma campanha --</option>
                {campanhas.map(camp => (
                  <option key={camp.id} value={camp.id}>
                    {camp.nome} - {camp.mensagem.substring(0, 30)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Informações da Campanha Selecionada */}
            {campanhaEscolhida && (
              <div style={{
                backgroundColor: '#fff',
                padding: '15px',
                marginBottom: '20px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
                <h4>Detalhes da Campanha:</h4>
                {campanhas.find(c => c.id === parseInt(campanhaEscolhida)) && (
                  <>
                    <p><strong>Mensagem:</strong> "{campanhas.find(c => c.id === parseInt(campanhaEscolhida)).mensagem}"</p>
                    <p><strong>Delay:</strong> {campanhas.find(c => c.id === parseInt(campanhaEscolhida)).delayMin}s - {campanhas.find(c => c.id === parseInt(campanhaEscolhida)).delayMax}s</p>
                  </>
                )}
              </div>
            )}

            {/* Seleção de Contatos */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Contatos ({contatosSelecionados.length} selecionados):
              </label>
              <div style={{
                border: '1px solid #ccc',
                borderRadius: '4px',
                maxHeight: '300px',
                overflowY: 'auto',
                backgroundColor: '#fff'
              }}>
                {contatos.length === 0 ? (
                  <p style={{ padding: '10px', color: '#999' }}>Nenhum contato disponível</p>
                ) : (
                  contatos.map(contato => (
                    <div
                      key={contato.id}
                      style={{
                        padding: '10px',
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        backgroundColor: contatosSelecionados.includes(contato.id) ? '#e3f2fd' : '#fff'
                      }}
                      onClick={() => toggleContatoSelecionado(contato.id)}
                    >
                      <input
                        type="checkbox"
                        checked={contatosSelecionados.includes(contato.id)}
                        onChange={() => toggleContatoSelecionado(contato.id)}
                        style={{ marginRight: '10px', cursor: 'pointer' }}
                      />
                      <div>
                        <strong>{contato.nome}</strong> - {contato.telefone}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !campanhaEscolhida || contatosSelecionados.length === 0}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: contatosSelecionados.length > 0 ? '#28a745' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: (loading || !campanhaEscolhida || contatosSelecionados.length === 0) ? 'not-allowed' : 'pointer',
                opacity: (loading || !campanhaEscolhida || contatosSelecionados.length === 0) ? 0.6 : 1,
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {loading ? '⏳ Enviando...' : `🚀 Enviar para ${contatosSelecionados.length} Contato(s)`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}