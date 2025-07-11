// src/components/Header.jsx
// ---------------------------------------
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const linkClass = ({ isActive }) =>
    `hover:text-orange-500 ${isActive ? 'text-orange-500 font-semibold' : ''}`;
  const isAuth = localStorage.getItem('auth') === 'true';
  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow fixed w-full z-10">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold text-orange-500">B2 Engenharia e Construção</NavLink>
        <ul className="flex space-x-6 items-center">
          <li><NavLink to="/" className={linkClass}>Início</NavLink></li>
          <li><NavLink to="/portfolio" className={linkClass}>Portfólio</NavLink></li>
          <li><NavLink to="/contato" className={linkClass}>Contato</NavLink></li>
          <li><NavLink to="/administracao" className={linkClass}>Administração</NavLink></li>
          {isAuth && (
            <li>
              <button onClick={handleLogout} className="hover:text-red-500 text-red-600">
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
