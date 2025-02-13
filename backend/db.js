const { Pool } = require("pg");

let pool;
async function connect() {
  try {
    // Verifica se já existe um pool ativo
    if (!pool) {
      pool = new Pool({
        connectionString: process.env.CONNECTION_STRING,
      });

      console.log("Criou o pool de conexão.");
    }

    // Testa a conexão e retorna o cliente
    const client = await pool.connect();
    console.log("Conexão estabelecida com sucesso!");

    // Exemplo de teste de consulta (pode ser removido em produção)
    const res = await client.query("SELECT NOW()");
    console.log("Hora atual no servidor:", res.rows[0]);

    // Libera o cliente para o pool
    client.release();

    return pool;
  } catch (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    throw err; // Lança o erro para que ele seja tratado pelo chamador
  }
}

// Exporta a função para uso em outras partes da aplicação
module.exports = { connect };

//-------------------clube-------------------

async function selectClubes() {
	const client = await connect();
	const res = await client.query("SELECT * FROM clube");
	return res.rows;
  }
  
  async function selectClube(id) {
	const client = await connect();
	const res = await client.query("SELECT * FROM clube WHERE id=$1", [id]);
	return res.rows[0];
  }
  
  async function insertClube(clube) {
	const client = await connect();
	const sql = "INSERT INTO clube (nome, fundacao) VALUES ($1, $2)";
	const values = [clube.nome, clube.fundacao];
	await client.query(sql, values);
  }
  
  async function updateClube(id, clube) {
	const client = await connect();
	const fields = [];
	const values = [];
	let index = 1;
  
	if (clube.nome) {
	  fields.push(`nome=$${index++}`);
	  values.push(clube.nome);
	}
	if (clube.fundacao) {
	  fields.push(`fundacao=$${index++}`);
	  values.push(clube.fundacao);
	}
  
	if (fields.length === 0) {
	  throw new Error("Nenhum campo para atualizar.");
	}
  
	values.push(id);
	const sql = `UPDATE clube SET ${fields.join(", ")} WHERE id=$${index}`;
  
	await client.query(sql, values);
  }
  
  async function deleteClube(id) {
	const client = await connect();
	const sql = "DELETE FROM clube WHERE id=$1";
	const values = [id];
	await client.query (sql,values);
  }

//---------torcedor-------------


async function selectTorcedores(){
	const client = await connect();
	const res = await client.query ("select * from torcedor" );
	return res.rows;
	
}

async function selectTorcedor(id){
	const client = await connect();
	const res = await client.query ("select * from torcedor where ID=$1",[id] );
	return res.rows;
	
}

async function insertTorcedor(torcedor) {
	const client = await connect();
	const sql = "INSERT INTO torcedor (nome, clube_id, nascimento) VALUES ($1, $2, $3)";
	const values = [torcedor.nome, torcedor.clube_id, torcedor.nascimento];
	await client.query(sql, values);
  }


async function updateTorcedor(id,torcedor) {
	const client = await connect();
	
	const fields = [];
	const values = [];
	let index = 1;
  
	if (torcedor.nome) {
	  fields.push(`nome=$${index++}`);
	  values.push(torcedor.nome);
	}
	if (torcedor.clube_id) {
		fields.push(`clube_id=$${index++}`);
		values.push(torcedor.clube_id);
	}
	if (torcedor.nascimento) {
	  fields.push(`nascimento=$${index++}`);
	  values.push(torcedor.nascimento);
	}
  
	if (fields.length === 0) {
	  throw new Error("Nenhum campo para atualizar.");
	}
  
	values.push(id); // Adiciona o ID no final da lista de valores
	const sql = `UPDATE torcedor SET ${fields.join(", ")} WHERE id=$${index}`;
	
	await client.query(sql, values);
  }

async function deleteTorcedor(id){
	const client = await connect();
	const sql = "delete from torcedor where id=$1";
	const values = [id];
	await client.query (sql,values);	
}

//----------campeonato------------

// Funções para a tabela competicao
async function selectCampeonatos() {
	const client = await connect();
	const res = await client.query("SELECT * FROM campeonato");
	return res.rows;
  }
  
  async function selectCampeonato(id) {
	const client = await connect();
	const res = await client.query("SELECT * FROM campeonato WHERE id=$1", [id]);
	return res.rows[0];
  }
  
  async function insertCampeonato(campeonato) {
	const client = await connect();
	const sql = "INSERT INTO campeonato (nome, serie) VALUES ($1, $2)";
	const values = [campeonato.nome, campeonato.serie];
	await client.query(sql, values);
  }
  
  async function updateCampeonato(id, campeonato) {
	const client = await connect();
	const fields = [];
	const values = [];
	let index = 1;
  
	if (campeonato.nome) {
	  fields.push(`nome=$${index++}`);
	  values.push(campeonato.nome);
	}
	if (campeonato.serie) {
	  fields.push(`serie=$${index++}`);
	  values.push(campeonato.serie);
	}
  
	if (fields.length === 0) {
	  throw new Error("Nenhum campo para atualizar.");
	}
  
	values.push(id);
	const sql = `UPDATE campeonato SET ${fields.join(", ")} WHERE id=$${index}`;
  
	await client.query(sql, values);
  }
  
  async function deleteCampeonato(id) {
	const client = await connect();
	const sql = "DELETE FROM campeonato WHERE id=$1";
	const values = [id];
	await client.query (sql,values);
  }
	
//----------liga------------

  // Funções para a tabela liga
  async function selectLigas() {
	const client = await connect();
	const res = await client.query("SELECT * FROM liga");
	return res.rows;
  }
  
  async function selectLiga(id) {
	const client = await connect();
	const res = await client.query("SELECT * FROM liga WHERE id=$1", [id]);
	return res.rows[0];
  }
  
  async function insertLiga(liga) {
	const client = await connect();
	const sql = "INSERT INTO liga (campeonato_id, clube_id) VALUES ($1, $2)";
	const values = [liga.campeonato_id, liga.clube_id];
	await client.query(sql, values);
  }
  
  async function updateLiga(id, liga) {
	const client = await connect();
	const fields = [];
	const values = [];
	let index = 1;
  
	if (liga.campeonato_id) {
	  fields.push(`campeonato_id=$${index++}`);
	  values.push(liga.campeonato_id);
	}
	if (liga.clube_id) {
	  fields.push(`clube_id=$${index++}`);
	  values.push(liga.clube_id);
	}
  
	if (fields.length === 0) {
	  throw new Error("Nenhum campo para atualizar.");
	}
  
	values.push(id);
	const sql = `UPDATE liga SET ${fields.join(", ")} WHERE id=$${index}`;
  
	await client.query(sql, values);
  }
  
  async function deleteLiga(id) {
	const client = await connect();
	const sql = "DELETE FROM liga WHERE id=$1";
	const values = [id];
	await client.query (sql,values);
  }

//----------placar------------
  
  // Funções para a tabela placar
  async function selectPlacares() {
	const client = await connect();
	const res = await client.query("SELECT * FROM placar");
	return res.rows;
  }
  
  async function selectPlacar(id) {
	const client = await connect();
	const res = await client.query("SELECT * FROM placar WHERE id=$1", [id]);
	return res.rows[0];
  }
  
  async function insertPlacar(placar) {
	const client = await connect();
	const sql = "INSERT INTO placar (liga_id, vitoria, derrota, empate, jogos) VALUES ($1, $2, $3, $4, $5)";
	const values = [placar.liga_id, 0,0,0,0];
	await client.query(sql, values);
  }
  
  async function updatePlacar(id, placar) {
	const client = await connect();
	const fields = [];
	const values = [];
	let index = 1;
  
	if (placar.liga_id !== undefined) {
	  fields.push(`liga_id=$${index++}`);
	  values.push(placar.liga_id);
	}
	if (placar.vitoria !== undefined) {
	  fields.push(`vitoria=$${index++}`);
	  values.push(placar.vitoria);
	}
	if (placar.derrota !== undefined) {
	  fields.push(`derrota=$${index++}`);
	  values.push(placar.derrota);
	}
	if (placar.empate !== undefined) {
	  fields.push(`empate=$${index++}`);
	  values.push(placar.empate);
	}
	if (placar.jogos !== undefined) {
	  fields.push(`jogos=$${index++}`);
	  values.push(placar.jogos);
	}
  
	if (fields.length === 0) {
	  throw new Error("Nenhum campo para atualizar.");
	}
  
	values.push(id);
	const sql = `UPDATE placar SET ${fields.join(", ")} WHERE id=$${index}`;
  
	await client.query(sql, values);
  }
  
  async function deletePlacar(id) {
	const client = await connect();
	const sql = "DELETE FROM placar WHERE id=$1";
	const values = [id];
	await client.query (sql,values);
  }

//-------------------------------
//----------relatorio------------


// async function countTorcedoresPorTime(time) {
//     const client = await connect();
//     try {
//         const sql = "SELECT COUNT(*) AS total_torcedores FROM torcedor WHERE time = $1";
//         const values = [time];
//         const res = await client.query(sql, values);
//         return res.rows[0]
//     } catch (error) {
//         console.error('Erro ao executar a consulta:', error);
//         throw error;
//     }
// }


// async function getTorcedoresPorTime(time) {
// 	const client = await pool.connect();
// 	try {
// 	  const res = await client.query(
// 		'SELECT nome FROM torcedor WHERE time = $1',
// 		[time]
// 	  );
// 	  return res.rows;
// 	} finally {
// 	  client.release();
// 	}
//   }

//   async function countTimePorSerie(serie) {
//     const client = await pool.connect();
//     try {
//         const sql = "SELECT COUNT(*) AS total_times FROM time WHERE serie = $1";
//         const values = [serie];
//         const res = await client.query(sql, values);
//         return res.rows[0];
//     } catch (error) {
//         console.error('Erro ao contar times por série:', error);
//         throw error;
//     } finally {
//         client.release();
//     }
// }

// async function getTimePorSerie(serie) {
//     const client = await pool.connect();
//     try {
//         const sql = "SELECT nome FROM time WHERE serie = $1";
//         const values = [serie];
//         const res = await client.query(sql, values);
//         return res.rows;
//     } catch (error) {
//         console.error('Erro ao buscar times por série:', error);
//         throw error;
//     } finally {
//         client.release();
//     }
// }


//----------tabela----------------------

async function getTabela(serie) {
    const client = await pool.connect();
    try {
        const sql = "SELECT nome, vitoria, derrota, empate FROM time WHERE serie = $1";
        const values = [serie];
        const res = await client.query(sql, values);
        return res.rows;
    } catch (error) {
        console.error('Erro ao buscar tabela por série:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function registrarResultado(serie, time1, time2, resultado) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Atualizar resultados dos times
        const sqlUpdate = `
            UPDATE time
            SET 
                vitoria = vitoria + $1,
                derrota = derrota + $2,
                empate = empate + $3
            WHERE nome = $4 AND serie = $5
        `;
        const { vitoria1, derrota1, empate1, vitoria2, derrota2, empate2 } = {
            vitoria1: resultado === 'time1' ? 1 : 0,
            derrota1: resultado === 'time2' ? 1 : 0,
            empate1: resultado === 'empate' ? 1 : 0,
            vitoria2: resultado === 'time2' ? 1 : 0,
            derrota2: resultado === 'time1' ? 1 : 0,
            empate2: resultado === 'empate' ? 1 : 0,
        };

        // Atualizar time1
        await client.query(sqlUpdate, [vitoria1, derrota1, empate1, time1, serie]);

        // Atualizar time2
        await client.query(sqlUpdate, [vitoria2, derrota2, empate2, time2, serie]);

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao registrar resultado:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function resetTabela() {
  const client = await pool.connect();
  try {
      const sql = `
          UPDATE time
          SET vitoria = 0, derrota = 0, empate = 0
      `;
      await client.query(sql);
  } catch (error) {
      console.error('Erro ao resetar a tabela:', error);
      throw error;
  } finally {
      client.release();
  }
}


module.exports = {
	selectClubes,
	selectClube,
	insertClube,
	updateClube,
	deleteClube,
	selectTorcedores,
	selectTorcedor,
	insertTorcedor,
	updateTorcedor,
	deleteTorcedor,
	selectCampeonatos,
	selectCampeonato,
	insertCampeonato,
	updateCampeonato,
	deleteCampeonato,
	selectLigas,
	selectLiga,
	insertLiga,
	updateLiga,
	deleteLiga,
	selectPlacares,
	selectPlacar,
	insertPlacar,
	updatePlacar,
	deletePlacar,
	// countTorcedoresPorTime,
	// getTorcedoresPorTime,
	// countTimePorSerie,
	// getTimePorSerie,
	getTabela,
	registrarResultado,
	resetTabela
}


