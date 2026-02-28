import { useState } from 'react';
import ImportCSV from '../components/ImportCSV';
import CriarCampanha from '../components/CriarCampanha';
import CriarFluxo from '../components/CriarFluxo';
import GerenciarFluxos from '../components/GerenciarFluxos';

export default function App() {
  const [pagina, setPagina] = useState('importar');

  const renderizarPagina = () => {
    switch (pagina) {
      case 'importar':
        return <ImportCSV />;
      case 'campanha':
        return <CriarCampanha />;
      case 'fluxo':
        return <CriarFluxo />;
      case 'gerenciar-fluxo':
        return <GerenciarFluxos />;
      default:
        return <ImportCSV />;
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 Flux - Disparador WhatsApp</h1>
      <nav style={{ marginBottom: 20, display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setPagina('importar')} 
          style={{
            padding: '10px 15px',
            backgroundColor: pagina === 'importar' ? '#007bff' : '#f0f0f0',
            color: pagina === 'importar' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📥 Importar Contatos
        </button>
        <button 
          onClick={() => setPagina('campanha')}
          style={{
            padding: '10px 15px',
            backgroundColor: pagina === 'campanha' ? '#007bff' : '#f0f0f0',
            color: pagina === 'campanha' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📢 Criar Campanha
        </button>
        <button 
          onClick={() => setPagina('fluxo')}
          style={{
            padding: '10px 15px',
            backgroundColor: pagina === 'fluxo' ? '#007bff' : '#f0f0f0',
            color: pagina === 'fluxo' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ⚙️ Criar Fluxo
        </button>
        <button 
          onClick={() => setPagina('gerenciar-fluxo')}
          style={{
            padding: '10px 15px',
            backgroundColor: pagina === 'gerenciar-fluxo' ? '#28a745' : '#f0f0f0',
            color: pagina === 'gerenciar-fluxo' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          👥 Adicionar ao Fluxo
        </button>
      </nav>
      <hr />
      {renderizarPagina()}
    </div>
  );
}