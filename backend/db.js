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
        return res.rows[0].total_torcedores;
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
}


