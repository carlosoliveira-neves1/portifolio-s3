// 5. Login Page (src/pages/Login.jsx)
// ---------------------------------------
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    if (user === 'admin' && pass === '190702') {
      localStorage.setItem('auth', 'true');
      navigate('/administracao');
    } else {
      alert('Usuário ou senha inválidos');
    }
  };

  return (
    <section className="max-w-sm mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Usuário"
          value={user}
          onChange={e => setUser(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={pass}
          onChange={e => setPass(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded">
          Entrar
        </button>
      </form>
    </section>
  );
}
