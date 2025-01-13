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
    const { time, serie } = req.query;

    if (!time && !serie) {
        return res.status(400).send({ error: "Os campos 'time' ou 'serie' são obrigatórios." });
    }

    try {
        let report = {};
        
        if (time) {
            const torcedoresReport = await db.countTorcedoresPorTime(time);
            const torcedores = await db.getTorcedoresPorTime(time);
            report = {
                total_torcedores: torcedoresReport.total_torcedores,
                torcedores: torcedores.map(torcedor => torcedor.nome),
            };
        }

        if (serie) {
            const timesReport = await db.countTimePorSerie(serie);
            const times = await db.getTimePorSerie(serie);
            report = {
                ...report,
                total_times: timesReport.total_times,
                times: times.map(time => time.nome),
            };
        }

        res.send(report);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Erro ao gerar o relatório.' });
    }
});


//-------------------tabela-------------------

app.get("/tabelas", async (req, res) => {
    const { serie } = req.query;

    if (!serie) {
        return res.status(400).send({ error: "O campo 'serie' é obrigatório." });
    }

    try {
        const tabela = await db.getTabela(serie);
        if (tabela.length === 0) {
            return res.status(404).send({ error: "Nenhuma tabela encontrada para a série informada." });
        }

        res.send({
            serie,
            tabela: tabela.map(time => ({
                nome: time.nome,
                vitoria: time.vitoria,
                derrota: time.derrota,
                empate: time.empate,
            })),
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Erro ao buscar a tabela.' });
    }
});

app.post('/resultados', async (req, res) => {
    console.log('Dados recebidos:', req.body);
    const { serie, time1, time2, resultado } = req.body;

    if (!serie || !time1 || !time2 || !resultado) {
        return res.status(400).send({ error: 'Todos os campos são obrigatórios.' });
    }

    if (time1 === time2) {
        return res.status(400).send({ error: 'Os times devem ser diferentes.' });
    }

    if (!['time1', 'time2', 'empate'].includes(resultado)) {
        return res.status(400).send({ error: 'O resultado deve ser "time1", "time2" ou "empate".' });
    }

    try {
        await db.registrarResultado(serie, time1, time2, resultado);
        res.send({ message: 'Resultado registrado com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Erro ao registrar o resultado.' });
    }
});

app.post('/reset-tabela', async (req, res) => {
    try {
        await db.resetTabela();
        res.send({ message: 'Tabela resetada com sucesso.' });
    } catch (err) {
        console.error('Erro ao resetar a tabela:', err);
        res.status(500).send({ error: 'Erro ao resetar a tabela.' });
    }
});



app.listen(port);
console.log(port);
console.log("backend rodando");