//import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./assets/pages/home";
import Torcedor from "./assets/pages/torcedor";
import Time from "./assets/pages/time";
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;