import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

function Resultado() {
  const [series, setSeries] = useState([]);
  const [selectedSerie, setSelectedSerie] = useState('');
  const [times, setTimes] = useState([]);
  const [time1, setTime1] = useState('');
  const [time2, setTime2] = useState('');
  const [resultado, setResultado] = useState('');

  useEffect(() => {
    // Buscar séries disponíveis
    api.get('/times').then((res) => {
      const seriesList = Array.from(new Set(res.data.map((team) => team.serie)));
      setSeries(seriesList);
    });
  }, []);

  useEffect(() => {
    if (selectedSerie) {
      // Buscar times da série selecionada
      api.get('/tabelas', { params: { serie: selectedSerie } }).then((res) => {
        setTimes(res.data.tabela);
      });
    }
  }, [selectedSerie]);

  const registrarResultado = async (e) => {
    e.preventDefault();

    if (!time1 || !time2 || !resultado || time1 === time2) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    try {
      const res = await api.post('/resultados', {
        serie: selectedSerie,
        time1,
        time2,
        resultado,
      });
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert('Erro ao registrar o resultado.');
    }
  };

  const resetTabela = async () => {
    if (window.confirm('Você tem certeza que deseja resetar a tabela?')) {
        try {
            const res = await api.post('/reset-tabela');
            alert(res.data.message);
        } catch (err) {
            console.error(err);
            alert('Erro ao resetar a tabela.');
        }
    }
  };

  return (
    <div>
      <h1>Registrar Resultado</h1>
      <form onSubmit={registrarResultado}>
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

        <label htmlFor="time1-select">Time 1:</label>
        <select
          id="time1-select"
          value={time1}
          onChange={(e) => setTime1(e.target.value)}
          disabled={!selectedSerie}
        >
          <option value="">--Selecione--</option>
          {times.map((time, index) => (
            <option key={index} value={time.nome}>
              {time.nome}
            </option>
          ))}
        </select>
        <br />

        <label htmlFor="time2-select">Time 2:</label>
        <select
          id="time2-select"
          value={time2}
          onChange={(e) => setTime2(e.target.value)}
          disabled={!selectedSerie}
        >
          <option value="">--Selecione--</option>
          {times.map((time, index) => (
            <option key={index} value={time.nome}>
              {time.nome}
            </option>
          ))}
        </select>
        <br />

        <label>Resultado:</label>
        <select
          value={resultado}
          onChange={(e) => setResultado(e.target.value)}
        >
          <option value="">--Selecione--</option>
          <option value="time1">Vitória do Time 1</option>
          <option value="time2">Vitória do Time 2</option>
          <option value="empate">Empate</option>
        </select>
        <br />

        <button type="submit">Registrar Resultado</button>

        <button onClick={resetTabela} style={{ marginTop: '20px', backgroundColor: 'red', color: 'white' }}>
          Resetar Tabela
        </button>
      </form>
    </div>
  );
}

export default Resultado;
