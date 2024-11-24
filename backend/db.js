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

async function updateTime(id,time){
	const client = await connect();
	const sql = "update time set nome=$1, serie=$2 ,fundacao=$3 where id=$4";
	const values = [time.nome,time.serie,time.fundacao, id];
	await client.query (sql,values);	
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

async function updateTorcedor(id,torcedor){
	const client = await connect();
	const sql = "update torcedor set nome=$1, time=$2 ,nascimento=$3 where id=$4";
	const values = [torcedor.nome,torcedor.time,torcedor.nascimento, id];
	await client.query (sql,values);	
}

async function deleteTorcedor(id){
	const client = await connect();
	const sql = "delete from torcedor where id=$1";
	const values = [id];
	await client.query (sql,values);	
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
}


