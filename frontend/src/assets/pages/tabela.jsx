import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

function Tabela() {
  const [series, setSeries] = useState([]);
  const [selectedSerie, setSelectedSerie] = useState('');
  const [tabela, setTabela] = useState(null);

  useEffect(() => {
    // Buscar séries disponíveis
    api.get('/times').then((res) => {
      const seriesList = Array.from(new Set(res.data.map((team) => team.serie)));
      setSeries(seriesList);
    });
  }, []);

  const buscarTabela = async (e) => {
    e.preventDefault();
    if (!selectedSerie) {
      alert('Selecione uma série!');
      return;
    }

    try {
      const res = await api.get('/tabelas', { params: { serie: selectedSerie } });
      setTabela(res.data);
    } catch (err) {
      console.error(err);
      alert('Erro ao buscar a tabela.');
    }
  };

  return (
    <div>
      <h1>Tabela de Times</h1>
      <form onSubmit={buscarTabela}>
        <label htmlFor="serie-select">Selecione uma série:</label>
        <select
          id="serie-select"
          value={selectedSerie}
          onChange={(e) => setSelectedSerie(e.target.value)}
        >
          <option value="">--Selecione--</option>
          {series.map((serie, index) => (
            <option key={index} value={serie}>
              {serie}
            </option>
          ))}
        </select>
        <br />
        <button type="submit">Buscar Tabela</button>
      </form>

      {tabela && (
        <div>
          <h2>Tabela da Série: {tabela.serie}</h2>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Vitórias</th>
                <th>Derrotas</th>
                <th>Empates</th>
              </tr>
            </thead>
            <tbody>
              {tabela.tabela.map((time, index) => (
                <tr key={index}>
                  <td>{time.nome}</td>
                  <td>{time.vitoria}</td>
                  <td>{time.derrota}</td>
                  <td>{time.empate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Tabela;
