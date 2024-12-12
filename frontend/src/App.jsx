//import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./assets/pages/home";
import Torcedor from "./assets/pages/torcedor";
import Time from "./assets/pages/time";
import Relatorio from "./assets/pages/relatorio";
import Navbar from "./assets/components/navbar";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/torcedor" element={<Torcedor />} />
          <Route path="/time" element={<Time />} />
          <Route path="/relatorio" element={<Relatorio />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
