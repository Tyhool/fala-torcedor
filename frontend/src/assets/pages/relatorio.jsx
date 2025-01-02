import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});

function App() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedSerie, setSelectedSerie] = useState('');
  const [report, setReport] = useState(null);

  useEffect(() => {
    // Buscar times
    api.get('/times').then((res) => {
      setTeams(res.data);
    });
  }, []);

  const gerarRelatorio = async (e) => {
    e.preventDefault();
    if (!selectedTeam && !selectedSerie) {
      alert('Selecione um time ou uma série!');
      return;
    }

    try {
      const params = {};
      if (selectedTeam) params.time = selectedTeam;
      if (selectedSerie) params.serie = selectedSerie;

      const res = await api.get('/relatorios', { params });
      setReport(res.data);
      alert(res.data );
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar o relatório.');
    }
  };

  return (
    <div>
      <div>
        <h1>Relatório</h1>
        <form onSubmit={gerarRelatorio}>
          <label htmlFor="time-select">Selecione um time:</label>
          <select
            id="time-select"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="">--Selecione--</option>
            {teams.map((team) => (
              <option key={team.id} value={team.nome}>
                {team.nome}
              </option>
            ))}
          </select>
            <br />
          <label htmlFor="serie-input">Informe a série:</label>
          <select
            id="serie-select"
            value={selectedSerie}
            onChange={(e) => setSelectedSerie(e.target.value)}
          >
            <option value="">--Selecione--</option>
            {Array.from(new Set(teams.map(team => team.serie))).map((serie, index) => (
              <option key={index} value={serie}>
                {serie}
              </option>
            ))}
          </select>
            <br />
          <button type="submit">Gerar Relatório</button>
        </form>

        {report && (
          <div>
            <h3>Resultado do Relatório</h3>
            {report.total_torcedores !== undefined && (
              <p>
                Time: {selectedTeam} <br />
                Serie: {teams.find((team) => team.nome === selectedTeam)?.serie || 'Série não encontrada'} <br />
                Total de torcedores: {report.total_torcedores} <br />
                Lista de Torcedores:
                <ul>
                  {report.torcedores.map((nome, index) => (
                    <li key={index}>{nome}</li>
                  ))}
                </ul>
              </p>
            )}
            {report.total_times !== undefined && (
              <p>
                Total de times na série: {report.total_times} <br />
                Lista de Times:
                <ul>
                  {report.times.map((nome, index) => (
                    <li key={index}>{nome}</li>
                  ))}
                </ul>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
