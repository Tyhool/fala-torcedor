import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

function Resultado() {
  const [campeonatos, setCampeonatos] = useState([]);
  const [selectedCampeonato, setSelectedCampeonato] = useState(null);
  const [clubes, setClubes] = useState([]);
  const [clube1, setClube1] = useState(null);
  const [clube2, setClube2] = useState(null);
  const [resultado, setResultado] = useState('');

  useEffect(() => {
    api.get('/campeonatos').then((res) => {
      setCampeonatos(res.data);
    });
  }, []);

  useEffect(() => {
    if (selectedCampeonato) {
      api.get('/clubes', { params: { campeonato_id: selectedCampeonato } }).then((res) => {
        setClubes(res.data);
      });
    } else {
      setClubes([]);
      setClube1(null);
      setClube2(null);
    }
  }, [selectedCampeonato]);

  const registrarResultado = async (e) => {
    e.preventDefault();

    if (!clube1 || !clube2 || !resultado || clube1 === clube2) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    try {
      const ligaResponse = await api.get('/ligas', {
        params: { campeonato_id: selectedCampeonato, clube_id: [clube1, clube2] },
      });

      if (ligaResponse.data.length === 0) {
        alert("Liga não encontrada para os clubes e campeonato selecionados.");
        return;
      }

      const liga_id = ligaResponse.data[0].id;

      const res = await api.post('/placares', {
        liga_id,
        vitoria: resultado === 'clube1' ? 1 : resultado === 'clube2' ? 0 : 0,
        derrota: resultado === 'clube1' ? 0 : resultado === 'clube2' ? 1 : 0,
        empate: resultado === 'empate' ? 1 : 0,
        jogos: 1,
      });
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert('Erro ao registrar o resultado.');
    }
  };

  return (
    <div>
      <h1>Registrar Resultado</h1>
      <form onSubmit={registrarResultado}>
        <label htmlFor="campeonato-select">Selecione um campeonato:</label>
        <select
          id="campeonato-select"
          value={selectedCampeonato || ''}
          onChange={(e) => setSelectedCampeonato(e.target.value ? parseInt(e.target.value) : null)}
        >
          <option value="">--Selecione--</option>
          {campeonatos.map((campeonato) => (
            <option key={campeonato.id} value={campeonato.id}>
              {campeonato.nome} ({campeonato.serie})
            </option>
          ))}
        </select>
        <br />

        <label htmlFor="clube1-select">Clube 1:</label>
        <select
          id="clube1-select"
          value={clube1 || ''}
          onChange={(e) => setClube1(e.target.value ? parseInt(e.target.value) : null)}
          disabled={!selectedCampeonato}
        >
          <option value="">--Selecione--</option>
          {clubes.map((clube) => (
            <option key={clube.id} value={clube.id}>
              {clube.nome}
            </option>
          ))}
        </select>
        <br />

        <label htmlFor="clube2-select">Clube 2:</label>
        <select
          id="clube2-select"
          value={clube2 || ''}
          onChange={(e) => setClube2(e.target.value ? parseInt(e.target.value) : null)}
          disabled={!selectedCampeonato}
        >
          <option value="">--Selecione--</option>
          {clubes.map((clube) => (
            <option key={clube.id} value={clube.id}>
              {clube.nome}
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
          <option value="clube1">Vitória do Clube 1</option>
          <option value="clube2">Vitória do Clube 2</option>
          <option value="empate">Empate</option>
        </select>
        <br />

        <button type="submit">Registrar Resultado</button>
      </form>
    </div>
  );
}

export default Resultado;
