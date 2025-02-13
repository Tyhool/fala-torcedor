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

//-------------------clube-------------------

// GET /clubes/:id
app.get("/clubes/:id", async (req, res) => {
    const clube = await db.selectClube(req.params.id);
    res.json(clube);
});

// GET /clubes
app.get("/clubes", async (req, res) => {
    const clubes = await db.selectClubes();
    res.json(clubes);
});

// POST /clubes
app.post("/clubes", async (req, res) => {
    console.log(req.body);
    await db.insertClube(req.body);
    res.sendStatus(201);
});

// PATCH /clubes/:id
app.patch("/clubes/:id", async (req, res) => {
    try {
        await db.updateClube(req.params.id, req.body);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send("Erro ao atualizar clube. msg: " + error);
    }
});

// DELETE /clubes/:id
app.delete("/clubes/:id", async (req, res) => {
    await db.deleteClube(req.params.id);
    res.sendStatus(204);
});

// //-------------------torcedor-------------------

// GET /torcedores/:id
app.get("/torcedores/:id", async (req, res) => {
    const torcedor = await db.selectTorcedor(req.params.id);
    res.json(torcedor);
});

// GET /torcedores
app.get("/torcedores", async (req, res) => {
    const torcedores = await db.selectTorcedores();
    res.json(torcedores);
});

// POST /torcedores
app.post("/torcedores", async (req, res) => {
    console.log(req.body);
    await db.insertTorcedor(req.body);
    res.sendStatus(201);
});

// PATCH /torcedores/:id
app.patch("/torcedores/:id", async (req, res) => {
    try {
        await db.updateTorcedor(req.params.id, req.body);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send("Erro ao atualizar torcedor. msg: " + error);
    }
});

// DELETE /torcedores/:id
app.delete("/torcedores/:id", async (req, res) => {
    await db.deleteTorcedor(req.params.id);
    res.sendStatus(204);
});


////-------------------campeonato-------------------

// GET /campeonatos/:id
app.get("/campeonatos/:id", async (req, res) => {
    const competicao = await db.selectCampeonato(req.params.id);
    res.json(competicao);
});

// GET /campeonatos
app.get("/campeonatos", async (req, res) => {
    const campeonatos = await db.selectCampeonatos();
    res.json(campeonatos);
});

// POST /campeonatos
app.post("/campeonatos", async (req, res) => {
    console.log(req.body);
    await db.insertCampeonato(req.body);
    res.sendStatus(201);
});

// PATCH /campeonatos/:id
app.patch("/campeonatos/:id", async (req, res) => {
    try {
        await db.updateCampeonato(req.params.id, req.body);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send("Erro ao atualizar competição. msg: " + error);
    }
});

// DELETE /campeonatos/:id
app.delete("/campeonatos/:id", async (req, res) => {
    await db.deleteCampeonato(req.params.id);
    res.sendStatus(204);
});

//--------------------ligas----------------------

// GET /ligas/:id
app.get("/ligas/:id", async (req, res) => {
    const liga = await db.selectLiga(req.params.id);
    res.json(liga);
});

// GET /ligas
app.get("/ligas", async (req, res) => {
    const ligas = await db.selectLigas();
    res.json(ligas);
});

// POST /ligas
app.post("/ligas", async (req, res) => {
    console.log(req.body);
    await db.insertLiga(req.body);
    res.sendStatus(201);
});

// PATCH /ligas/:id
app.patch("/ligas/:id", async (req, res) => {
    try {
        await db.updateLiga(req.params.id, req.body);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send("Erro ao atualizar liga. msg: " + error);
    }
});

// DELETE /ligas/:id
app.delete("/ligas/:id", async (req, res) => {
    await db.deleteLiga(req.params.id);
    res.sendStatus(204);
});


//-------------------placar-------------------
// GET /placares/:id
app.get("/placares/:id", async (req, res) => {
    const placar = await db.selectPlacar(req.params.id);
    res.json(placar);
});

// GET /placares
app.get("/placares", async (req, res) => {
    const placares = await db.selectPlacares();
    res.json(placares);
});

// POST /placares
app.post("/placares", async (req, res) => {
    console.log(req.body);
    await db.insertPlacar(req.body);
    res.sendStatus(201);
});

// PATCH /placares/:id
app.patch("/placares/:id", async (req, res) => {
    try {
        await db.updatePlacar(req.params.id, req.body);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send("Erro ao atualizar placar. msg: " + error);
    }
});

// DELETE /placares/:id
app.delete("/placares/:id", async (req, res) => {
    await db.deletePlacar(req.params.id);
    res.sendStatus(204);
});

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

// app.get("/tabelas", async (req, res) => {
//     const { serie } = req.query;

//     if (!serie) {
//         return res.status(400).send({ error: "O campo 'serie' é obrigatório." });
//     }

//     try {
//         const tabela = await db.getTabela(serie);
//         if (tabela.length === 0) {
//             return res.status(404).send({ error: "Nenhuma tabela encontrada para a série informada." });
//         }

//         res.send({
//             serie,
//             tabela: tabela.map(time => ({
//                 nome: time.nome,
//                 vitoria: time.vitoria,
//                 derrota: time.derrota,
//                 empate: time.empate,
//             })),
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send({ error: 'Erro ao buscar a tabela.' });
//     }
// });

// app.post('/resultados', async (req, res) => {
//     console.log('Dados recebidos:', req.body);
//     const { serie, time1, time2, resultado } = req.body;

//     if (!serie || !time1 || !time2 || !resultado) {
//         return res.status(400).send({ error: 'Todos os campos são obrigatórios.' });
//     }

//     if (time1 === time2) {
//         return res.status(400).send({ error: 'Os times devem ser diferentes.' });
//     }

//     if (!['time1', 'time2', 'empate'].includes(resultado)) {
//         return res.status(400).send({ error: 'O resultado deve ser "time1", "time2" ou "empate".' });
//     }

//     try {
//         await db.registrarResultado(serie, time1, time2, resultado);
//         res.send({ message: 'Resultado registrado com sucesso.' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send({ error: 'Erro ao registrar o resultado.' });
//     }
// });

// app.post('/reset-tabela', async (req, res) => {
//     try {
//         await db.resetTabela();
//         res.send({ message: 'Tabela resetada com sucesso.' });
//     } catch (err) {
//         console.error('Erro ao resetar a tabela:', err);
//         res.status(500).send({ error: 'Erro ao resetar a tabela.' });
//     }
// });

//-------------------Campeonato-------------------

app.get("/campeonatos/:id", async (req,res) => {
	const campeonato = await db.selectCampeonato(req.params.id);
	res.json(campeonato);
});

app.get("/campeonatos", async (req,res) => {
	const campeonatos = await db.selectCampeonatos();
	res.json(campeonatos);
});

app.post("/campeonatos", async (req,res) => {
	console.log(req.body);
	await db.insertCampeonato(req.body);
	res.sendStatus(201);
});


app.patch("/campeonatos/:id", async (req, res) => {
	try {
	  await db.updateCampeonato(req.params.id, req.body);
	  res.sendStatus(200);
	} catch (error) {
	  res.status(500).send("Erro ao atualizar campeonato. msg: " + error);
	}
  });


app.delete("/campeonatos/:id", async (req,res) => {
	await db.deleteCampeonato(req.params.id);
	res.sendStatus(204);
});


app.listen(port);
console.log(port);
console.log("backend rodando");