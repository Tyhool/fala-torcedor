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

async function selectTimes(){
	const client = await connect();
	const res = await client.query ("select * from time" );
	return res.rows;
	
}

async function selectTime(id){
	const client = await connect();
	const res = await client.query ("select * from time where ID=$1",[id] );
	return res.rows;
	
}

async function insertTime(time){
	const client = await connect();
	const sql = "insert into time(nome,serie,fundacao) values ($1,$2,$3)";
	const values = [time.nome,time.serie,time.fundacao];
	const res = await client.query (sql,values);	
}

  async function updateTime(id, time) {
	const client = await connect();
	
	const fields = [];
	const values = [];
	let index = 1;
  
	if (time.nome) {
	  fields.push(`nome=$${index++}`);
	  values.push(time.nome);
	}
	if (time.serie) {
	  fields.push(`serie=$${index++}`);
	  values.push(time.serie);
	}
	if (time.fundacao) {
	  fields.push(`fundacao=$${index++}`);
	  values.push(time.fundacao);
	}
  
	if (fields.length === 0) {
	  throw new Error("Nenhum campo para atualizar.");
	}
  
	values.push(id); // Adiciona o ID no final da lista de valores
	const sql = `UPDATE time SET ${fields.join(", ")} WHERE id=$${index}`;
	
	await client.query(sql, values);
  }


async function deleteTime(id){
	const client = await connect();
	const sql = "delete from time where id=$1";
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
	const res = await client.query ("select * from time where ID=$1",[id] );
	return res.rows;
	
}

async function insertTorcedor(torcedor){
	const client = await connect();
	const sql = "insert into torcedor(nome,time,nascimento) values ($1,$2,$3)";
	const values = [torcedor.nome,torcedor.time,torcedor.nascimento];
	const res = await client.query (sql,values);	
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
	if (torcedor.time) {
	  fields.push(`time=$${index++}`);
	  values.push(torcedor.time);
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

//----------relatorio------------


async function countTorcedoresPorTime(time) {
    const client = await connect();
    try {
        const sql = "SELECT COUNT(*) AS total_torcedores FROM torcedor WHERE time = $1";
        const values = [time];
        const res = await client.query(sql, values);
        return res.rows[0]
    } catch (error) {
        console.error('Erro ao executar a consulta:', error);
        throw error;
    }
}


async function getTorcedoresPorTime(time) {
	const client = await pool.connect();
	try {
	  const res = await client.query(
		'SELECT nome FROM torcedor WHERE time = $1',
		[time]
	  );
	  return res.rows;
	} finally {
	  client.release();
	}
  }

  async function countTimePorSerie(serie) {
    const client = await pool.connect();
    try {
        const sql = "SELECT COUNT(*) AS total_times FROM time WHERE serie = $1";
        const values = [serie];
        const res = await client.query(sql, values);
        return res.rows[0];
    } catch (error) {
        console.error('Erro ao contar times por série:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function getTimePorSerie(serie) {
    const client = await pool.connect();
    try {
        const sql = "SELECT nome FROM time WHERE serie = $1";
        const values = [serie];
        const res = await client.query(sql, values);
        return res.rows;
    } catch (error) {
        console.error('Erro ao buscar times por série:', error);
        throw error;
    } finally {
        client.release();
    }
}


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
	selectTimes,
	selectTime,
	insertTime,
	updateTime,
	deleteTime,
	selectTorcedores,
	selectTorcedor,
	insertTorcedor,
	updateTorcedor,
	deleteTorcedor,
	countTorcedoresPorTime,
	getTorcedoresPorTime,
	countTimePorSerie,
	getTimePorSerie,
	getTabela,
	registrarResultado,
  resetTabela,
}


