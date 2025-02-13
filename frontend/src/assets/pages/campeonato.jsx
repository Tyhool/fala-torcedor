import { useState, useEffect } from 'react'
import axios from 'axios'
import '../../App.css'


const api = axios.create({
  baseURL: 'http://localhost:3000'
})

function Campeonato() {

  const [campeonatos, setCampeonatos] = useState([])
  const [id, setId] = useState('')
  const [nome, setNome] = useState('')
  const [serie, setSerie] = useState('')

  useEffect(() => {
    api.get('/campeonatos').then((res) => {
      console.log(res.data)
      setCampeonatos(res.data)
    })
  }, [])

  function novoCampeonato(e) {
    e.preventDefault(); // Evita que a página recarregue
    api.post('/campeonatos', { 
      nome, 
      serie
    }).then(() => {
      window.location.reload(); // Recarrega a página inteira
    }).then((res) => {
      setCampeonatos(res.data); // Atualiza a lista de times no estado
      setNome('');
      setSerie('');
    }).catch((err) => {
      console.error(err);
    });
  }

  function alterarCampeonato(id) {
    const updatedCampeonato = {};
    if (nome) updatedCampeonato.nome = nome;
    if (serie) updatedCampeonato.serie = serie;
  
    api.patch(`/campeonatos/${id}`, updatedCampeonato).then((res) => {
      console.log(res.data);
      setCampeonatos(campeonatos.map((campeonato) => campeonato.id === id ? { ...campeonato, ...updatedCampeonato } : campeonato));
    }).catch((error) => {
      console.error("Erro ao atualizar campeonato:", error);
    });
  }

  function excluirCampeonato(id) {
    api.delete(`/campeonatos/${id}`, { data: { id } }).then(() => {
      setCampeonatos(campeonatos.filter((campeonato) => campeonato.id !== id))
    })
  }

 
  return (
    <div>
      <div>
        <h1>Campeonato</h1>
        <ul>
          {campeonatos.map((campeonato) => (
            <li key={campeonato.id}>
              Campeonato: {campeonato.nome} - Serie: {campeonato.serie}
            </li>
          ))}
        </ul>

        <h2>Novo Campeonato</h2>
        <form>
          <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input type="text" placeholder="Serie" value={serie} onChange={(e) => setSerie(e.target.value)} />
          <button onClick={novoCampeonato} type="submit">Salvar</button>
        </form>

          <h2>Alterar Campeonato</h2>
        <form>
          <input type="text" placeholder="Digite o ID" value={id} onChange={(e) => setId(e.target.value)} />
          <input type="text" placeholder="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input type="text" placeholder="Serie" value={serie} onChange={(e) => setSerie(e.target.value)} />
          <button onClick={alterarCampeonato(id)}>Alterar</button>
        </form>

          <h2>Excluir Time</h2>
        <form>
          <input type="text" placeholder="Digite o ID" value={id} onChange={(e) => setId(e.target.value)} />
          <button onClick={() => excluirCampeonato(id)}>Excluir</button>
        </form>
          <ul>
            {campeonatos.map((campeonato) => (
              <li key={campeonato.id}>
                {campeonato.nome} (ID: {campeonato.id})
              </li>
            ))}
          </ul>
      </div>
      
    </div>


  )
}

export default Campeonato
