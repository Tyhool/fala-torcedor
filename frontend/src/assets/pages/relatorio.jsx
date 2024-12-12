import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});

function App() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [report, setReport] = useState(null);

  //------------------relatorio----------------

  useEffect(() => {
    // Buscar times
    api.get('/times').then((res) => {
      console.log(res.data);
      setTeams(res.data);
    });
  }, []);
  
  
  const gerarRelatorio = async (e) => {
    e.preventDefault();
    if (!selectedTeam) {
      alert('Selecione um time!');
      return;
    }

    try {
      const res = await api.get('/relatorios', { params: { time: selectedTeam } });
      setReport(res.data);
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
          <button type="submit">Gerar Relatório</button>
        </form>

        {report && (
          <div>
            <h3>Resultado do Relatório</h3>
            <p>
              Time: {selectedTeam} <br /> Total de torcedores: {report.total_torcedores}
            </p>
            <h3>Lista de Torcedores</h3>
            <ul>
              {report.torcedores.map((nome, index) => (
                  <li key={index}>{nome}</li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;