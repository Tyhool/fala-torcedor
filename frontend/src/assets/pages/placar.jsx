import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});

function Placar() {
  const [ligas, setLigas] = useState([]);
  const [placares, setPlacares] = useState([]);
  const [campeonatos, setCampeonatos] = useState([]);
  const [clubes, setClubes] = useState([]);
  const [selectedCampeonato, setSelectedCampeonato] = useState('');
  const [clubesDoCampeonato, setClubesDoCampeonato] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/ligas'),
      api.get('/placares'),
      api.get('/campeonatos'),
      api.get('/clubes')
    ]).then(([ligasRes, placaresRes, campeonatosRes, clubesRes]) => {
      setLigas(ligasRes.data);
      setPlacares(placaresRes.data);
      setCampeonatos(campeonatosRes.data);
      setClubes(clubesRes.data);
    }).catch(err => console.error(err));
  }, []);

  function handleCampeonatoChange(e) {
    const campeonatoId = e.target.value;
    setSelectedCampeonato(campeonatoId);
    
    const ligasDoCampeonato = ligas.filter(liga => liga.campeonato_id === parseInt(campeonatoId));
    const clubesFiltrados = ligasDoCampeonato.map(liga => clubes.find(clube => clube.id === liga.clube_id));
    setClubesDoCampeonato(clubesFiltrados.filter(clube => clube));
  }

  function salvarPlacar() {
    if (!selectedCampeonato) {
      alert('Selecione um campeonato válido.');
      return;
    }

    const ligasDoCampeonato = ligas.filter(liga => liga.campeonato_id === parseInt(selectedCampeonato));
    
    Promise.all(ligasDoCampeonato.map(liga => {
      const novoPlacar = {
        liga_id: liga.id,
        vitoria: 0,
        empate: 0,
        derrota: 0,
        jogos: 0
      };
      return api.post('/placares', novoPlacar);
    }))
    .then(() => alert('Placar salvo com sucesso!'))
    .catch(err => console.error(err));
  }

  function deletarPlacaresPorCampeonato(campeonatoId) {
    if (window.confirm("Tem certeza que deseja deletar todos os placares deste campeonato?")) {
      // Encontra os IDs dos placares relacionados ao campeonato
      const placaresParaDeletar = placares.filter(placar => {
        const liga = ligas.find(l => l.id === placar.liga_id);
        return liga && liga.campeonato_id === parseInt(campeonatoId);
      }).map(placar => placar.id);

      // Se não houver placares para deletar, exibe um alerta
      if (placaresParaDeletar.length === 0) {
        alert("Não há placares para deletar neste campeonato.");
        return;
      }

      // Deleta os placares individualmente
      Promise.all(placaresParaDeletar.map(placarId => api.delete(`/placares/${placarId}`)))
        .then(() => {
          alert('Placares deletados com sucesso!');
          return api.get('/placares'); // Atualiza a lista de placares
        })
        .then(placaresRes => setPlacares(placaresRes.data))
        .catch(err => console.error(err));
    }
  }

  return (
    <div>
      <h1>Placares</h1>
      <ul>
        {placares.map((placar) => {
          // Encontra a liga correspondente ao placar
          const liga = ligas.find((l) => l.id === placar.liga_id);
          // Encontra o campeonato e clube usando os dados da liga
          const campeonato = campeonatos.find((c) => c.id === liga?.campeonato_id);
          const clube = clubes.find((c) => c.id === liga?.clube_id);
          
          return (
            <li key={placar.id}>
              {campeonato?.nome || "Não encontrado"} {campeonato?.serie && `  ${campeonato.serie}`} 
              : {clube?.nome || "Não encontrado"} | 
              Vitórias: {placar.vitoria} | 
              Derrotas: {placar.derrota} | 
              Empates: {placar.empate} | 
              Jogos: {placar.jogos}
            </li>
          );
        })}
      </ul>

      <h2>Adicionar Placar</h2>
      <select value={selectedCampeonato} onChange={handleCampeonatoChange}>
        <option value="">Selecione um Campeonato</option>
        {campeonatos.map((campeonato) => (
          <option key={campeonato.id} value={campeonato.id}>
            {campeonato.nome} {campeonato.serie}
          </option>
        ))}
      </select>
      
      <h2>Clubes do Campeonato</h2>
      <ul>
        {clubesDoCampeonato.map(clube => (
          <li key={clube.id}>{clube.nome}</li>
        ))}
      </ul>

      <button onClick={salvarPlacar}>Salvar Placar</button>

      {/* Botão para deletar todos os placares de um campeonato */}
      <h2>Deletar Placares por Campeonato</h2>
      <select value={selectedCampeonato} onChange={handleCampeonatoChange}>
        <option value="">Selecione um Campeonato</option>
        {campeonatos.map((campeonato) => (
          <option key={campeonato.id} value={campeonato.id}>
            {campeonato.nome} {campeonato.serie}
          </option>
        ))}
      </select>
      <button onClick={() => deletarPlacaresPorCampeonato(selectedCampeonato)}>
        Deletar Todos do Campeonato
      </button>
    </div>
  );
}

export default Placar;
