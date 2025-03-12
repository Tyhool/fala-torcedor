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
  const [clube1, setClube1] = useState('');
  const [clube2, setClube2] = useState('');
  const [resultado, setResultado] = useState('');

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

  const registrarResultado = async () => {
    if (!clube1 || !clube2 || !resultado) return;

    const atualizarPlacar = async (clubeId, vitoria, empate, derrota) => {
        try {
            const clube = clubesNaLiga.find(c => c.id === parseInt(clubeId));
            if (clube && clube.placar) {
                await api.patch(`/placares/${clube.placar.id}`, { // Use PATCH
                    vitoria: clube.placar.vitoria + vitoria,
                    empate: clube.placar.empate + empate, // Corrected: empate
                    derrota: clube.placar.derrota + derrota,
                    jogos: clube.placar.jogos + 1
                });
                // Refresh placares after update:
                const res = await api.get('/placares');
                setPlacares(res.data);
            }
        } catch (error) {
            console.error("Error updating placar:", error);
            // Handle error, e.g., display a message to the user
        }
    };

    if (resultado === 'vitoria1') {
      atualizarPlacar(clube1, 1, 0, 0);
      atualizarPlacar(clube2, 0, 0, 1);
    } else if (resultado === 'vitoria2') {
      atualizarPlacar(clube1, 0, 0, 1);
      atualizarPlacar(clube2, 1, 0, 0);
    } else if (resultado === 'empate') {
      atualizarPlacar(clube1, 0, 1, 0);
      atualizarPlacar(clube2, 0, 1, 0);
    }
  };

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
              <td>{clube.placar?.empate || 0}</td>
              <td>{clube.placar?.derrota || 0}</td>
              <td>{clube.placar?.jogos || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Registrar Resultado</h2>
      <select value={clube1} onChange={(e) => setClube1(e.target.value)}>
        <option value="">Selecione o Clube 1</option>
        {clubesNaLiga.map((clube) => (
          <option key={clube.id} value={clube.id}>{clube.nome}</option>
        ))}
      </select>
      <select value={clube2} onChange={(e) => setClube2(e.target.value)}>
        <option value="">Selecione o Clube 2</option>
        {clubesNaLiga.map((clube) => (
          <option key={clube.id} value={clube.id}>{clube.nome}</option>
        ))}
      </select>
      <select value={resultado} onChange={(e) => setResultado(e.target.value)}>
        <option value="">Selecione o Resultado</option>
        <option value="vitoria1">Vitória Clube 1</option>
        <option value="empate">Empate</option>
        <option value="vitoria2">Vitória Clube 2</option>
      </select>
      <button onClick={registrarResultado}>Registrar</button>
    </div>
  );
}

export default Tabela;
