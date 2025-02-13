import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});

function Liga() {
  const [ligas, setLigas] = useState([]);
  const [campeonatos, setCampeonatos] = useState([]); // Estado para armazenar a lista de campeonatos
  const [clubes, setClubes] = useState([]); // Estado para armazenar a lista de clubes
  const [id, setId] = useState('');
  const [campeonato_id, setCampeonatoID] = useState(''); // Estado para armazenar o campeonato selecionado
  const [clube_id, setClubeId] = useState(''); // Estado para armazenar o clube selecionado

  // Busca a lista de ligas, campeonatos e clubes ao carregar o componente
  useEffect(() => {
    api.get('/ligas').then((res) => {
      setLigas(res.data);
    });

    api.get('/campeonatos').then((res) => {
      setCampeonatos(res.data); // Armazena a lista de campeonatos
    });

    api.get('/clubes').then((res) => {
      setClubes(res.data); // Armazena a lista de clubes
    });
  }, []);

  // Função para criar uma nova liga
  function novaLiga(e) {
    e.preventDefault();
    api.post('/ligas', { campeonato_id, clube_id }).then(() => {
      window.location.reload(); // Recarrega a página após a criação
    }).catch((err) => {
      console.error(err);
    });
  }

  // Função para alterar uma liga existente
  function alterarLiga(id) {
    const updatedLiga = {};
    if (campeonato_id) updatedLiga.campeonato_id = campeonato_id;
    if (clube_id) updatedLiga.clube_id = clube_id;

    api.patch(`/ligas/${id}`, updatedLiga).then((res) => {
      console.log(res.data);
      setLigas(ligas.map((liga) => liga.id === id ? { ...liga, ...updatedLiga } : liga));
    }).catch((error) => {
      console.error("Erro ao atualizar liga:", error);
    });
  }

  // Função para excluir uma liga
  function excluirLiga(id) {
    api.delete(`/ligas/${id}`).then(() => {
      setLigas(ligas.filter((liga) => liga.id !== id));
    });
  }

  return (
    <div>
      <h1>Ligas</h1>
      <ul>
      {ligas.map((liga) => {
        // Encontra o nome do campeonato e do clube associados à liga
        const campeonato = campeonatos.find((c) => c.id === liga.campeonato_id);
        const clube = clubes.find((c) => c.id === liga.clube_id);
        return (
          <li key={liga.id}>
            Campeonato: {campeonato ? campeonato.nome : "Campeonato não encontrado"}
            {campeonato && campeonato.serie ? ` - Serie: ${campeonato.serie}` : ""} 
            - Clube: {clube ? clube.nome : "Clube não encontrado"}
          </li>
        );
      })}
      </ul>

      <h2>Nova Liga</h2>
      <form>
        {/* Dropdown para selecionar o campeonato */}
        <select value={campeonato_id} onChange={(e) => setCampeonatoID(e.target.value)}>
          <option value="">Selecione um campeonato</option>
          {campeonatos.map((campeonato) => (
            <option key={campeonato.id} value={campeonato.id}>
              {campeonato.nome} {campeonato.serie ? `Serie: ${campeonato.serie}` : ' '}
            </option>
          ))}
        </select>

        {/* Dropdown para selecionar o clube */}
        <select value={clube_id} onChange={(e) => setClubeId(e.target.value)}>
          <option value="">Selecione um clube</option>
          {clubes.map((clube) => (
            <option key={clube.id} value={clube.id}>
              {clube.nome}
            </option>
          ))}
        </select>

        <button onClick={novaLiga} type="submit">Salvar</button>
      </form>

      <h2>Alterar Liga</h2>
      <form>
        <input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} />
        
        {/* Dropdown para selecionar o campeonato na alteração */}
        <select value={campeonato_id} onChange={(e) => setCampeonatoID(e.target.value)}>
          <option value="">Selecione um campeonato</option>
          {campeonatos.map((campeonato) => (
            <option key={campeonato.id} value={campeonato.id}>
              {campeonato.nome}
            </option>
          ))}
        </select>

        {/* Dropdown para selecionar o clube na alteração */}
        <select value={clube_id} onChange={(e) => setClubeId(e.target.value)}>
          <option value="">Selecione um clube</option>
          {clubes.map((clube) => (
            <option key={clube.id} value={clube.id}>
              {clube.nome}
            </option>
          ))}
        </select>

        <button onClick={() => alterarLiga(id)}>Alterar</button>
      </form>

      <h2>Excluir Liga</h2>
      <form>
        <input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} />
        <button onClick={() => excluirLiga(id)}>Excluir</button>
      </form>
      <ul>
      {ligas.map((liga) => {
  // Encontra o campeonato correspondente ao campeonato_id da liga
        const campeonato = campeonatos.find((campeonato) => campeonato.id === liga.campeonato_id);
        return (
          <li key={liga.id}>
            {campeonato ? (
              <option key={campeonato.id} value={campeonato.id}>
                {campeonato.nome} {campeonato.serie}:
              </option>
            ) : (
              <option value="">Campeonato não encontrado</option>
            )}
            {liga.campeonato_id} (ID: {liga.id})
          </li>
        );
      })}
        </ul>
    </div>
  );
}

export default Liga;
