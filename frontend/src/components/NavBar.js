import React from 'react';
import {Link} from 'react-router-dom';

export default function NavBar(){
    return(
        <div className="navbar">
            <div className="logo">
                PC BUILDS
            </div>
            <ul>
                <li><Link to="/">Pagrindinis</Link></li>
                <li><Link to="/detales">Detalės</Link></li>
            </ul>
        </div>
    )
}