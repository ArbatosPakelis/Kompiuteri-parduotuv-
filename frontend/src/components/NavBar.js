import React from 'react';
import {Link} from 'react-router-dom';

export default function NavBar(){
    return(
        <div className="navbar">
            <nav role="navigation">
                <ul>
                    <li><Link to="/">Pagrindinis</Link></li>
                    <li><Link to="/detales">Detalės</Link>
                        <ul className="dropdown">
                            <li><Link to="/detales?tipas=motinine_plokste">Motininė plokštė</Link></li>
                            <li><Link to="/detales?tipas=vaizdo_plokste">Vaizdo plokštė</Link></li>
                            <li><Link to="/detales?tipas=procesorius">Procesorius</Link></li>
                            <li><Link to="/detales?tipas=maitinimo_blokas">Maitinimo blokas</Link></li>
                            <li><Link to="/detales?tipas=kompiuterio_pele">Kompiuterio pėlė</Link></li>
                            <li><Link to="/detales?tipas=atmintis">Atmintis</Link></li>
                            <li><Link to="/detales?tipas=klaviatura">Klaviatūra</Link></li>
                            <li><Link to="/detales?tipas=monitorius">Monitorius</Link></li>
                            <li><Link to="/detales?tipas=ausintuvas">Aušintuvas</Link></li>
                            <li><Link to="/detales?tipas=isorine_atmintis">Išorinė atmintis</Link></li>
                            <li><Link to="/detales?tipas=kabelis">Kabelis</Link></li>
                        </ul>
                    </li>
                    <li>Rinkiniai</li>
                </ul>
            </nav>
            <div className="logo">
                PC BUILDS
            </div>
        </div>
    )
}