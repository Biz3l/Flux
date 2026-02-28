import { useState, useEffect } from 'react';
import { listarFluxos, listarContatos, adicionarAoFluxo } from '../services/api';
import { limparContatos } from '../services/api';

const GerenciarFluxos = () => {
  const [fluxos, setFluxos] = useState([]);
  const [contatos, setContatos] = useState([]);
  const [fluxoSelecionado, setFluxoSelecionado] = useState(null);
  const [contatosSelecionados, setContatosSelecionados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [expandido, setExpandido] = useState(null);

  // Carregar fluxos e contatos ao montar
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [fluxosResponse, contatosResponse] = await Promise.all([
        listarFluxos(),
        listarContatos()
      ]);
      setFluxos(fluxosResponse.data || []);
      setContatos(contatosResponse.data || []);
    } catch (err) {
      setMensagem(`❌ Erro ao carregar dados: ${err.message}`);
    }
  };

  const handleSelecionarFluxo = (fluxoId) => {
    setFluxoSelecionado(fluxoId);
    setContatosSelecionados([]);
    setMensagem('');
  };

  const handleToggleContato = (contatoId) => {
    setContatosSelecionados(prev => {
      if (prev.includes(contatoId)) {
        return prev.filter(id => id !== contatoId);
      } else {
        return [...prev, contatoId];
      }
    });
  };

  const handleAdicionarAoFluxo = async () => {
    if (!fluxoSelecionado || contatosSelecionados.length === 0) {
      setMensagem('❌ Selecione um fluxo e pelo menos um contato');
      return;
    }

    setLoading(true);
    setMensagem('');

    try {
      const resultado = await adicionarAoFluxo(fluxoSelecionado, contatosSelecionados);
      setMensagem(`✅ ${contatosSelecionados.length} contato(s) adicionado(s) ao fluxo!`);
      setContatosSelecionados([]);
      setFluxoSelecionado(null);
      
      // Recarregar dados
      setTimeout(() => {
        carregarDados();
        setMensagem('');
      }, 2000);
    } catch (err) {
      const mensagemErro = err.response?.data?.erro || err.response?.data?.message || err.message;
      setMensagem(`❌ Erro: ${mensagemErro}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLimparContatos = async () => {

    setLoading(true);
    setMensagem('');


    try {
      const resultado = await limparContatos();
      console.log(resultado);
      setMensagem(`✅ ${resultado.data.message}`);

      setContatosSelecionados([]);

      setTimeout(() => {
        carregarDados();
        setMensagem('');
      }, 2000);


    } catch (err) {
      const mensagemErro = err.response?.data?.erro || err.response?.data?.message || err.message;
      setMensagem(`❌ Erro: ${mensagemErro}`);
    } finally {
      setLoading(false)
    }
  }

  const fluxoAtual = fluxos.find(f => f.id === fluxoSelecionado);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2>👥 Adicionar Contatos ao Fluxo</h2>
      
      {mensagem && (
        <div style={{
          padding: '12px',
          marginBottom: '15px',
          backgroundColor: mensagem.includes('✅') ? '#d4edda' : '#f8d7da',
          color: mensagem.includes('✅') ? '#155724' : '#721c24',
          borderRadius: '4px',
          border: `1px solid ${mensagem.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {mensagem}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Coluna 1: Fluxos */}
        <div>
          <h3>📋 Fluxos Disponíveis</h3>
          {fluxos.length === 0 ? (
            <p style={{ color: '#666' }}>Nenhum fluxo criado ainda</p>
          ) : (
            <div style={{ 
              border: '1px solid #ddd',
              borderRadius: '4px',
              maxHeight: '500px',
              overflowY: 'auto'
            }}>
              {fluxos.map(fluxo => (
                <div key={fluxo.id}>
                  <button
                    onClick={() => {
                      handleSelecionarFluxo(fluxo.id);
                      setExpandido(expandido === fluxo.id ? null : fluxo.id);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: 'none',
                      borderBottom: '1px solid #eee',
                      backgroundColor: fluxoSelecionado === fluxo.id ? '#e3f2fd' : 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: fluxoSelecionado === fluxo.id ? 'bold' : 'normal',
                      color: fluxoSelecionado === fluxo.id ? '#1976d2' : 'black'
                    }}
                  >
                    <span>{fluxo.nome}</span>
                    <span style={{ 
                      float: 'right',
                      fontSize: '12px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '3px'
                    }}>
                      {fluxo.etapas?.length || 0} etapas
                    </span>
                  </button>

                  {/* Mostrar etapas do fluxo expandido */}
                  {expandido === fluxo.id && fluxo.etapas && (
                    <div style={{
                      padding: '10px',
                      backgroundColor: '#f9f9f9',
                      borderBottom: '1px solid #eee'
                    }}>
                      {fluxo.etapas.map((etapa, idx) => (
                        <div key={idx} style={{
                          padding: '8px',
                          marginBottom: '8px',
                          backgroundColor: 'white',
                          borderRadius: '3px',
                          border: '1px solid #eee',
                          fontSize: '12px'
                        }}>
                          <strong>Etapa {idx + 1}</strong> (Delay: {etapa.delayMin}min)
                          <p style={{ margin: '5px 0', color: '#555' }}>{etapa.mensagem}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coluna 2: Contatos */}
        <div>
          <h3>👤 Contatos ({contatosSelecionados.length} selecionados)</h3>
          {contatos.length === 0 ? (
            <p style={{ color: '#666' }}>Nenhum contato importado. Importe contatos primeiro.</p>
          ) : (
            <div style={{
              border: '1px solid #ddd',
              borderRadius: '4px',
              maxHeight: '500px',
              overflowY: 'auto'
            }}>
              {contatos.map(contato => (
                <label
                  key={contato.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    backgroundColor: contatosSelecionados.includes(contato.id) ? '#e3f2fd' : 'white'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={contatosSelecionados.includes(contato.id)}
                    onChange={() => handleToggleContato(contato.id)}
                    style={{ marginRight: '10px', cursor: 'pointer' }}
                  />
                  <span>
                    <strong>{contato.nome}</strong> <br />
                    <span style={{ fontSize: '12px', color: '#666' }}>{contato.telefone}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Resumo e botão */}
      {fluxoAtual && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f0f8ff',
          borderRadius: '4px',
          borderLeft: '4px solid #1976d2'
        }}>
          <h4>📌 Resumo da Ação</h4>
          <p><strong>Fluxo selecionado:</strong> {fluxoAtual.nome}</p>
          <p><strong>Contatos a adicionar:</strong> {contatosSelecionados.length}</p>
          {fluxoAtual.etapas && (
            <p><strong>Etapas do fluxo:</strong> {fluxoAtual.etapas.length}</p>
          )}
        </div>
      )}

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={handleAdicionarAoFluxo}
          disabled={!fluxoSelecionado || contatosSelecionados.length === 0 || loading}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (!fluxoSelecionado || contatosSelecionados.length === 0 || loading) ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            opacity: (!fluxoSelecionado || contatosSelecionados.length === 0 || loading) ? 0.6 : 1
          }}
        >
          {loading ? '⏳ Adicionando...' : '✅ Adicionar ao Fluxo'}
        </button>
        <button
          onClick={() => {
            setFluxoSelecionado(null);
            setContatosSelecionados([]);
            setExpandido(null);
          }}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          🔄 Limpar Seleção
        </button>
      </div>

      <button onClick={handleLimparContatos} style={{
        marginTop: "5px",
        flex: 1,
        padding: '12px',
        backgroundColor: '#ff2929',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        opacity: 1
      }}>
        🧹 Limpar Contatos
      </button>

      {/* Informações úteis */}
      <div style={{
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#fff3cd',
        borderRadius: '4px',
        fontSize: '13px',
        color: '#856404'
      }}>
        <strong>💡 Como usar:</strong><br/>
        1. Selecione um fluxo na coluna esquerda<br/>
        2. Marque os contatos na coluna direita<br/>
        3. Clique em "Adicionar ao Fluxo"<br/>
        4. Os contatos começarão a receber as mensagens automaticamente!
      </div>
    </div>
  );
};

export default GerenciarFluxos;
