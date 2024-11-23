import { useState, useEffect } from 'react'
import axios from 'axios'
import '../../App.css'


const api = axios.create({
  baseURL: 'http://localhost:3000'
})

function App() {

  const [users, setUsers] = useState([])
  const [id, setId] = useState('')
  const [nome, setNome] = useState('')
  const [serie, setSerie] = useState('')
  const [fundacao, setFundacao] = useState('')



  //------------------time----------------
  useEffect(() => {
    api.get('/times').then((res) => {
      console.log(res.data)
      setUsers(res.data)
    })
  }, [])

  function novoTime() {
    api.post('/times', { nome, serie, fundacao }).then((res) => {
      console.log(res.data)
      setUsers([...users, res.data])
    })
  }


  function alterarTime(id) {
    api.patch(`/times/${id}`, { id, nome, serie, fundacao }).then((res) => {
      console.log(res.data)
      setUsers(users.map((user) => user.id === id ? res.data : user))
    })
  }

  function excluirTime(id) {
    api.delete(`/times/${id}`, { data: { id } }).then(() => {
      setUsers(users.filter((user) => user.id !== id))
    })
  }

 
  return (
    <div>
      <div>
        <h1>Times</h1>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              Nome:{user.nome} - Serie:{user.serie} - Fundacao:{user.fundacao}
            </li>
          ))}
        </ul>

        <h2>Novo Time</h2>
        <form>
          <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input type="text" placeholder="Serie" value={serie} onChange={(e) => setSerie(e.target.value)} />
          <input type="text" placeholder="Fundacao" value={fundacao} onChange={(e) => setFundacao(e.target.value)} />
          <button onClick={novoTime}>Salvar</button>


          <h2>Alterar Time</h2>

          <input type="text" placeholder="Digite o ID" value={id} onChange={(e) => setId(e.target.value)} />
          <input type="text" placeholder="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input type="text" placeholder="Serie" value={serie} onChange={(e) => setSerie(e.target.value)} />
          <input type="text" placeholder="Fundacao" value={fundacao} onChange={(e) => setFundacao(e.target.value)} />

          <button onClick={() => alterarTime(id)}>Alterar</button>


          <h2>Excluir Time</h2>

          <input type="text" placeholder="Digite o ID" value={id} onChange={(e) => setId(e.target.value)} />
          <button onClick={() => excluirTime(id)}>Excluir</button>
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
