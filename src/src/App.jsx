// src/App.jsx (rotas)
// ---------------------------------------
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PortfolioPage from './pages/PortfolioPage';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="contato" element={<Contact />} />
        <Route path="administracao" element={<PrivateRoute><Admin /></PrivateRoute>} />
      </Route>
    </Routes>
  );
}