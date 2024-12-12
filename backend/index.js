const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '.env')});

const db = require("./db");

const port = process.env.PORT;

const express = require ("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());


// index
app.get("/", (req,res)=> {
	res.json({
		message: "Funcionando!"
	})
});

//-------------------time-------------------

app.get("/times/:id", async (req,res) => {
	const time = await db.selectTime(req.params.id);
	res.json(time);
});

app.get("/times", async (req,res) => {
	const times = await db.selectTimes();
	res.json(times);
});

app.post("/times", async (req,res) => {
	console.log(req.body);
	await db.insertTime(req.body);
	res.sendStatus(201);
});

app.patch("/times/:id", async (req, res) => {
	try {
	  await db.updateTime(req.params.id, req.body);
	  res.sendStatus(200);
	} catch (error) {
	  res.status(500).send("Erro ao atualizar time. msg: " + error);
	}
  });

app.delete("/times/:id", async (req,res) => {
	await db.deleteTime(req.params.id);
	res.sendStatus(204);
});

// //-------------------torcedor-------------------

app.get("/torcedores/:id", async (req,res) => {
	const torcedor = await db.selectTorcedor(req.params.id);
	res.json(torcedor);
});

app.get("/torcedores", async (req,res) => {
	const torcedores = await db.selectTorcedores();
	res.json(torcedores);		
});

app.post("/torcedores", async (req,res) => {
	console.log(req.body);						
	await db.insertTorcedor(req.body);
	res.sendStatus(201);
});

app.patch("/torcedores/:id", async (req, res) => {
	try {
	  await db.updateTorcedor(req.params.id, req.body);
	  res.sendStatus(200);
	} catch (error) {
	  res.status(500).send("Erro ao atualizar torcedor. msg: " + error);
	}	
  });

app.delete("/torcedores/:id", async (req,res) => {	
	await db.deleteTorcedor(req.params.id);
	res.sendStatus(204);
})	

//-------------------relatorio-------------------

app.get("/relatorios", async (req, res) => {
    const { time } = req.query;

    if (!time) {
        return res.status(400).send({ error: "O campo 'time' é obrigatório." });
    }

    try {
		const report = await db.countTorcedoresPorTime(time);
		const torcedores = await db.getTorcedoresPorTime(time);
	
		res.send({
		  total_torcedores: report.total_torcedores,
		  torcedores: torcedores.map(torcedor => torcedor.nome),
		});
	  } catch (err) {
		console.error(err);
		res.status(500).send({ error: 'Erro ao gerar o relatório.' });
	  }
});


app.listen(port);
console.log(port);
console.log("backend rodando");