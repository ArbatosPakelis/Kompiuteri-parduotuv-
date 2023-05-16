import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavBar() {
    const isActiveLink = (path) => {
        const currentPath = window.location.pathname;
        if (path === "/detales/lyginti") {
          // Check if the current path starts with "/detales" but is not exactly "/detales/lyginti"
          return currentPath.startsWith("/detales") && currentPath !== "/detales/lyginti";
        } else {
          return currentPath === path;
        }
      };

  return (
    <div className="navbar">
      <nav role="navigation">
        <ul>
          <li>
            <NavLink exact to="/" className="nav-link" activeClassName="active">
              Pagrindinis
            </NavLink>
          </li>
          <li>
            <NavLink to="/lyginti" className={`nav-link ${isActiveLink('/detales/lyginti') && 'active'}`}>
              Detalių palyginimas
            </NavLink>
          </li>
          <li>
            <NavLink to="/rinkiniai" className="nav-link" activeClassName="active">
              Rinkiniai
            </NavLink>
          </li>
          <li>
            <NavLink to="/detales" className={`nav-link ${isActiveLink('/detales') && 'active'}`}>
              Detalės
            </NavLink>
            <ul className="dropdown">
              {/* Dropdown items */}
            </ul>
          </li>
        </ul>
      </nav>
      <div className="logo">PC BUILDS</div>
    </div>
  );
}
