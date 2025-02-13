import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});

function Torcedor() {
  const [torcedores, setTorcedores] = useState([]);
  const [clubes, setClubes] = useState([]); // Estado para armazenar a lista de clubes
  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [clube_id, setClubeId] = useState(''); // Estado para armazenar o clube_id selecionado
  const [nascimento, setNascimento] = useState('');

  // Busca a lista de torcedores e clubes ao carregar o componente
  useEffect(() => {
    api.get('/torcedores').then((res) => {
      setTorcedores(res.data);
    });

    api.get('/clubes').then((res) => {
      setClubes(res.data); // Armazena a lista de clubes
    });
  }, []);

  // Função para criar um novo torcedor
  function novoTorcedor(e) {
    e.preventDefault();
    api.post('/torcedores', { nome, clube_id, nascimento }).then(() => {
      window.location.reload(); // Recarrega a página após a criação
    }).catch((err) => {
      console.error(err);
    });
  }

  // Função para alterar um torcedor existente
  function alterarTorcedor(id) {
    const updatedTorcedor = {};
    if (nome) updatedTorcedor.nome = nome;
    if (clube_id) updatedTorcedor.clube_id = clube_id;
    if (nascimento) updatedTorcedor.nascimento = nascimento;

    api.patch(`/torcedores/${id}`, updatedTorcedor).then((res) => {
      console.log(res.data);
      setTorcedores(torcedores.map((torcedor) => torcedor.id === id ? { ...torcedor, ...updatedTorcedor } : torcedor));
    }).catch((error) => {
      console.error("Erro ao atualizar torcedor:", error);
    });
  }

  // Função para excluir um torcedor
  function excluirTorcedor(id) {
    api.delete(`/torcedores/${id}`).then(() => {
      setTorcedores(torcedores.filter((torcedor) => torcedor.id !== id));
    });
  }

  return (
    <div>
      <h1>Torcedores</h1>
      <ul>
        {torcedores.map((torcedor) => {
          // Encontra o nome do clube associado ao torcedor
          const clube = clubes.find((c) => c.id === torcedor.clube_id);
          const dataOriginal = torcedor.nascimento;
          const dataFormatada = dataOriginal.split("T")[0];
          return (
            <li key={torcedor.id}>
              Nome: {torcedor.nome} - Clube: {clube ? clube.nome : "Clube não encontrado"} - Nascimento: {dataFormatada}
            </li>
          );
        })}
      </ul>

      <h2>Novo Torcedor</h2>
      <form>
        <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        
        {/* Dropdown para selecionar o clube */}
        <select value={clube_id} onChange={(e) => setClubeId(e.target.value)}>
          <option value="">Selecione um clube</option>
          {clubes.map((clube) => (
            <option key={clube.id} value={clube.id}>
              {clube.nome}
            </option>
          ))}
        </select>

        <input type="date" placeholder="Nascimento" value={nascimento} onChange={(e) => setNascimento(e.target.value)} />
        <button onClick={novoTorcedor} type="submit">Salvar</button>
      </form>

      <h2>Alterar Torcedor</h2>
      <form>
        <input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} />
        <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        
        {/* Dropdown para selecionar o clube na alteração */}
        <select value={clube_id} onChange={(e) => setClubeId(e.target.value)}>
          <option value="">Selecione um clube</option>
          {clubes.map((clube) => (
            <option key={clube.id} value={clube.id}>
              {clube.nome}
            </option>
          ))}
        </select>

        <input type="date" placeholder="Nascimento" value={nascimento} onChange={(e) => setNascimento(e.target.value)} />
        <button onClick={() => alterarTorcedor(id)}>Alterar</button>
      </form>

      <h2>Excluir Torcedor</h2>
      <form>
        <input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} />
        <button onClick={() => excluirTorcedor(id)}>Excluir</button>
      </form>

      <ul>
            {torcedores.map((torcedor) => (
              <li key={torcedor.id}>
                {torcedor.nome} (ID: {torcedor.id})
              </li>
            ))}
        </ul>
    </div>
  );
}

export default Torcedor;