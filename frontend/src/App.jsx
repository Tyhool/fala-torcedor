//import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./assets/pages/home";
import Campeonato from "./assets/pages/campeonato";
import Clube from "./assets/pages/clube";
import Liga from "./assets/pages/liga";
import Placar from "./assets/pages/placar";
import Torcedor from "./assets/pages/torcedor";
import Tabela from "./assets/pages/tabela";
import Relatorio from "./assets/pages/relatorio";
import Navbar from "./assets/components/navbar";
//import Resultado from "./assets/pages/resultado";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campeonato" element={<Campeonato />} />
           <Route path="/clube" element={<Clube />} />
           <Route path="/torcedor" element={<Torcedor />} />
           <Route path="/liga" element={<Liga />} />
          <Route path="/placar" element={<Placar />} />
          <Route path="/tabela" element={<Tabela />} />
          <Route path="/relatorio" element={<Relatorio />} />
          {/*
          <Route path="/resultado" element={<Resultado />} /> 
          */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
