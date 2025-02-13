//import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/campeonato">Campeonato</Link>
                </li>
                <li>
                    <Link to="/clube">Clube</Link>
                </li>
                <li>
                    <Link to="/torcedor">Torcedor</Link>
                </li>
                <li>
                    <Link to="/liga">Liga</Link>
                </li>
                <li>
                    <Link to="/placar">Placar</Link>
                </li>
                <p>----------------------------------------------</p>
                <li>
                    <Link to="/tabela">Tabela</Link>
                </li>
                <li>
                    <Link to="/relatorio">Relatorio</Link>
                </li>
                {/*
                <li>
                    <Link to="/Resultado">Resultado</Link>
                </li>
 */}
                
            </ul>
        </nav>
    );
};

export default Navbar;