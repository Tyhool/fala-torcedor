import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});

function Tabela() {
  const [campeonatos, setCampeonatos] = useState([]);
  const [ligas, setLigas] = useState([]);
  const [clubes, setClubes] = useState([]);
  const [placares, setPlacares] = useState([]);
  const [campeonatoId, setCampeonatoId] = useState('');
  const [clubesNaLiga, setClubesNaLiga] = useState([]);

  useEffect(() => {
    api.get('/campeonatos').then((res) => setCampeonatos(res.data));
    api.get('/ligas').then((res) => setLigas(res.data));
    api.get('/clubes').then((res) => setClubes(res.data));
    api.get('/placares').then((res) => setPlacares(res.data));
  }, []);

  useEffect(() => {
    if (campeonatoId) {
      const clubesFiltrados = clubes.filter((clube) => 
        ligas.some((liga) => liga.clube_id === clube.id && liga.campeonato_id === parseInt(campeonatoId))
      ).map(clube => {
        const liga = ligas.find(liga => liga.clube_id === clube.id && liga.campeonato_id === parseInt(campeonatoId));
        const placar = placares.find(p => p.liga_id === liga?.id);
        return {
          ...clube,
          placar
        };
      });
      setClubesNaLiga(clubesFiltrados);
    }
  }, [campeonatoId, ligas, clubes, placares]);

  return (
    <div>
      <h1>Tabela de Clubes no Campeonato</h1>
      <form>
        <select value={campeonatoId} onChange={(e) => setCampeonatoId(e.target.value)}>
          <option value="">Selecione um Campeonato</option>
          {campeonatos.map((campeonato) => (
            <option key={campeonato.id} value={campeonato.id}>
              {campeonato.nome} {campeonato.serie}
            </option>
          ))}
        </select>
      </form>

      <h2>Clubes no Campeonato Selecionado</h2>
      <table>
        <thead>
          <tr>
            <th>Nome do Clube</th>
            <th>Vitórias</th>
            <th>Empates</th>
            <th>Derrotas</th>
            <th>Jogos</th>
          </tr>
        </thead>
        <tbody>
          {clubesNaLiga.map((clube) => (
            <tr key={clube.id}>
              <td>{clube.nome}</td>
              <td>{clube.placar?.vitoria || 0}</td>
              <td>{clube.placar?.empates || 0}</td>
              <td>{clube.placar?.derrotas || 0}</td>
              <td>{clube.placar?.jogos || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Tabela;