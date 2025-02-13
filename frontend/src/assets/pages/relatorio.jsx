import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';

const api = axios.create({
  baseURL: 'http://localhost:3000' // Ajuste a URL da sua API
});

function App() {
  const [campeonatos, setCampeonatos] = useState([]);
  const [ligas, setLigas] = useState([]);
  const [clubes, setClubes] = useState([]);
  const [clubesNaLiga, setClubesNaLiga] = useState([]);
  const [torcedores, setTorcedores] = useState([]);
  const [torcedoresDoClube, setTorcedoresDoClube] = useState([]); // Novo estado
  const [selectedCampeonato, setSelectedCampeonato] = useState('');
  const [selectedClube, setSelectedClube] = useState('');

  useEffect(() => {
    // Buscar campeonatos
    api.get('/campeonatos').then((res) => {
      setCampeonatos(res.data);
    });

    // Buscar ligas
    api.get('/ligas').then((res) => {
      setLigas(res.data);
    });

    // Buscar clubes
    api.get('/clubes').then((res) => {
      setClubes(res.data);
    });

    // Buscar torcedores (inicialmente vazio)
    api.get('/torcedores').then((res) => {
      setTorcedores(res.data);
    });
  }, []);

  useEffect(() => {
    if (selectedCampeonato) {
      const clubesFiltrados = clubes.filter((clube) =>
        ligas.some((liga) => liga.clube_id === clube.id && liga.campeonato_id === parseInt(selectedCampeonato))
      );
      setClubesNaLiga(clubesFiltrados);
      setSelectedClube(''); // Resetar seleção de clube ao mudar campeonato
      setTorcedoresDoClube([]); // Resetar torcedores ao mudar campeonato
    } else {
      setClubesNaLiga([]);
      setSelectedClube('');
      setTorcedoresDoClube([]);
    }
  }, [selectedCampeonato, ligas, clubes]);

  useEffect(() => {
    if (selectedClube) {
      const torcedoresFiltrados = torcedores.filter((torcedor) => torcedor.clube_id === parseInt(selectedClube));
      setTorcedoresDoClube(torcedoresFiltrados);
    } else {
      setTorcedoresDoClube([]);
    }
  }, [selectedClube, torcedores]);

  return (
    <div>
      <h1>Consulta de Clubes e Torcedores</h1>

      {/* Seleção de Campeonato */}
      <label htmlFor="campeonato-select">Selecione um campeonato:</label>
      <select
        id="campeonato-select"
        value={selectedCampeonato}
        onChange={(e) => setSelectedCampeonato(e.target.value)}
      >
        <option value="">--Selecione--</option>
        {campeonatos.map((camp) => (
          <option key={camp.id} value={camp.id}>{camp.nome} {camp.serie}</option>
        ))}
      </select>

      {/* Listar Clubes */}
      {clubesNaLiga.length > 0 && (
        <div>
          <h3>Clubes do Campeonato</h3>
          <ul>
            {clubesNaLiga.map((clube) => (
              <li key={clube.id}>{clube.nome}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Seleção de Clube */}
      <label htmlFor="clube-select">Selecione um clube:</label>
      <select
        id="clube-select"
        value={selectedClube}
        onChange={(e) => setSelectedClube(e.target.value)}
      >
        <option value="">--Selecione--</option>
        {clubesNaLiga.map((clube) => (
          <option key={clube.id} value={clube.id}>{clube.nome}</option>
        ))}
      </select>

      {/* Listar Torcedores */}
      {torcedoresDoClube.length > 0 && (
        <div>
          <h3>Torcedores do Clube</h3>
          <ul>
            {torcedoresDoClube.map((torcedor) => (
              <li key={torcedor.id}>{torcedor.nome}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;