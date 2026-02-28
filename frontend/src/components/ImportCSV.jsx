import { useState } from 'react';
import { importarContato } from '../services/api';

export default function ImportCSV() {
  const [file, setFile] = useState(null);

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return alert('Selecione um arquivo CSV');

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const linhas = text.split('\n');

      for (const linha of linhas) {
        if (!linha.trim()) continue; // pula linhas vazias
        if (linha.includes('nome') && linha.includes('telefone')) continue;
        const partes = linha.split(',').map(p => p.trim());
        const nome = partes[0];
        const telefone = partes[1];
        if (nome && telefone) {
          try {
            await importarContato({ nome, telefone });
          } catch (err) {
            console.error('Erro importando linha', linha, err);
            alert(`Falha ao importar "${linha}": ${err.response?.data?.erro || err.message}`);
          }
        }
      }
      alert('Importação concluída!');
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <h2>Importar Contatos</h2>
      <input type="file" accept=".csv" onChange={handleFile} style={{}} />
      <br/>
      <button onClick={handleUpload} style={{
        flex: 1,
        padding: '12px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '5px',
      }}>Enviar CSV</button>
    </div>
  );
}