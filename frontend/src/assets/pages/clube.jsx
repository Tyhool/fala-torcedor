import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});

function Clube() {
  const [clubes, setClubes] = useState([]);
  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [fundacao, setFundacao] = useState('');

  useEffect(() => {
    api.get('/clubes').then((res) => {
      setClubes(res.data);
    });
  }, []);

  function novoClube(e) {
    e.preventDefault();
    api.post('/clubes', { nome, fundacao }).then(() => {
      window.location.reload();
    }).catch((err) => {
      console.error(err);
    });
  }

  function alterarClube(id) {
    const updatedClube = {};
    if (nome) updatedClube.nome = nome;
    if (fundacao) updatedClube.fundacao = fundacao;

    api.patch(`/clubes/${id}`, updatedClube).then((res) => {
      console.log(res.data);
      setClubes(clubes.map((clube) => clube.id === id ? { ...clube, ...updatedClube } : clube));
    }).catch((error) => {
      console.error("Erro ao atualizar clube:", error);
    });
  }

  function excluirClube(id) {
    api.delete(`/clubes/${id}`).then(() => {
      setClubes(clubes.filter((clube) => clube.id !== id));
    });
  }

  return (
    <div>
      <h1>Clubes</h1>
      <ul>
        {clubes.map((clube) => {
          const dataOriginal = clube.fundacao;
          const [ano, mes, dia] = dataOriginal.split("T")[0].split("-");
          const dataFormatada = `${dia}/${mes}/${ano}`;
          return (
            <li key={clube.id}>
              Clube: {clube.nome} - Fundação: {dataFormatada}
            </li>
          );
        })}
      </ul>

      <h2>Novo Clube</h2>
      <form>
        <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input type="date" placeholder="Fundação" value={fundacao} onChange={(e) => setFundacao(e.target.value)} />
        <button onClick={novoClube} type="submit">Salvar</button>
      </form>

      <h2>Alterar Clube</h2>
      <form>
        <input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} />
        <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input type="date" placeholder="Fundação" value={fundacao} onChange={(e) => setFundacao(e.target.value)} />
        <button onClick={() => alterarClube(id)}>Alterar</button>
      </form>

      <h2>Excluir Clube</h2>
      <form>
        <input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} />
        <button onClick={() => excluirClube(id)}>Excluir</button>
      </form>
      <ul>
            {clubes.map((clube) => (
              <li key={clube.id}>
                {clube.nome} (ID: {clube.id})
              </li>
            ))}
        </ul>
    </div>
  );
}

export default Clube;