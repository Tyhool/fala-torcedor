require("dotenv").config();

const db = require("./db");

const port = process.env.PORT;
const express = require ("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());



app.get("/", (req,res)=> {
	res.json({
		message: "Funcionando!"
	})
})
//-------------------time-------------------
app.get("/times/:id", async (req,res) => {
	const time = await db.selectTime(req.params.id);
	res.json(time);

})

app.get("/times", async (req,res) => {
	const times = await db.selectTimes();
	res.json(times);

})

app.post("/times", async (req,res) => {
	console.log(req.body);
	await db.insertTime(req.body);
	res.sendStatus(201);

})

app.patch("/times/:id", async (req, res) => {
	try {
	  await db.updateTime(req.params.id, req.body);
	  res.sendStatus(200);
	} catch (error) {
	  console.error("Erro ao atualizar time:", error);
	  res.status(500).send("Erro ao atualizar time.");
	}
  });

app.delete("/times/:id", async (req,res) => {
	await db.deleteTime(req.params.id);
	res.sendStatus(204);

})

//-------------------torcedor-------------------

app.get("/torcedores/:id", async (req,res) => {
	const torcedor = await db.selectTorcedor(req.params.id);
	res.json(torcedor);

})	

app.get("/torcedores", async (req,res) => {
	const torcedores = await db.selectTorcedores();
	res.json(torcedores);		
})

app.post("/torcedores", async (req,res) => {
	console.log(req.body);						
	await db.insertTorcedor(req.body);
	res.sendStatus(201);
})	

app.patch("/torcedores/:id", async (req, res) => {
	try {
	  await db.updateTorcedor(req.params.id, req.body);
	  res.sendStatus(200);
	} catch (error) {
	  console.error("Erro ao atualizar torcedor:", error);
	  res.status(500).send("Erro ao atualizar torcedor.");
	}	
  });

app.delete("/torcedores/:id", async (req,res) => {	
	await db.deleteTorcedor(req.params.id);
	res.sendStatus(204);
})	


app.listen(port);
console.log("backend rodando");