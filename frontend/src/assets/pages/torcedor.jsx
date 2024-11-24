import { useState, useEffect } from 'react'
import axios from 'axios'
import '../../App.css'


const api = axios.create({
  baseURL: 'http://localhost:3000'
})

function App() {

  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [id, setId] = useState('')
  const [nome, setNome] = useState('')
  const [time, setTime] = useState('')
  const [nascimento, setNascimento] = useState('')

  //------------------torcedor----------------

  useEffect(() => {
    api.get('/torcedores').then((res) => {
      console.log(res.data)
      setUsers(res.data)
    });

    // Buscar times
    api.get('/times').then((res) => {
      console.log(res.data)
      setTeams(res.data);
    });
  }, [])

  function novoTorcedor() {
    api.post('/torcedores', { nome, time, nascimento }).then((res) => {
      console.log(res.data)
      setUsers([...users, res.data]);
    });
  }

  function alterarTorcedor(id) {
    api.patch(`/torcedores/${id}`, { id, nome, time, nascimento }).then((res) => {
      console.log(res.data)
      setUsers(users.map((user) => user.id === id ? res.data : user))
    }).catch(error => {
      console.error("Erro ao atualizar torcedor:", error);
    });
  }

  function excluirTorcedor(id) {
    api.delete(`/torcedores/${id}`, { data: { id } }).then(() => {
      setUsers(users.filter((user) => user.id !== id))
    })
  }

  return (
    <div>
      <div>
        <h1>Torcedores</h1>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              Nome:{user.nome} - Time:{user.time} - Nascimento:{user.nascimento}
            </li>
          ))} 
        </ul>

        <h2>Novo Torcedor</h2>
        <form>
          <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />

          <select value={time} onChange={(e) => setTime(e.target.value)}>
            <option value="">Selecione um time</option>
            {teams.map((team) => (
              <option key={team.id} value={team.nome}>
                {team.nome}
              </option>
            ))}
          </select>
          <input type="text" placeholder="Nascimento" value={nascimento} onChange={(e) => setNascimento(e.target.value)} />
          <button onClick={novoTorcedor}>Salvar</button>


          <h2>Alterar Torcedor</h2>
          <input type="text" placeholder="Digite o ID" value={id} onChange={(e) => setId(e.target.value)} />
          <input type="text" placeholder="nome" value={nome} onChange={(e) => setNome(e.target.value)} />

          <select value={time} onChange={(e) => setTime(e.target.value)}>
            <option value="">Selecione um time</option>
            {teams.map((team) => (
              <option key={team.id} value={team.nome}>
                {team.nome}
              </option>
            ))}
          </select>

          <input type="text" placeholder="Nascimento" value={nascimento} onChange={(e) => setNascimento(e.target.value)} />
          <button onClick={alterarTorcedor(id)}>Alterar</button>


          <h2>Excluir Torcedor</h2>

          <input type="text" placeholder="Digite o ID" value={id} onChange={(e) => setId(e.target.value)} />
          <button onClick={() => excluirTorcedor(id)}>Excluir</button>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.nome} (ID: {user.id})
              </li>
            ))}
          </ul>
        </form>
      </div>

    </div>
  )
}

export default App
