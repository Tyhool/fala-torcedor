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
                    <Link to="/torcedor">Torcedor</Link>
                </li>
                <li>
                    <Link to="/time">Time</Link>
                </li>
                <li>
                    <Link to="/relatorio">Relatorio</Link>
                </li>
                <li>
                    <Link to="/tabela">Tabela</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;