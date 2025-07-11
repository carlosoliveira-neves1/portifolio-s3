// src/pages/Contact.jsx
import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    const { name, email, message } = form;
    const subject = encodeURIComponent(`Contato de ${name}`);
    const body = encodeURIComponent(
      `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`
    );
    // Envia para os dois e-mails separados por vírgula
    window.location.href =
      `mailto:b2constru@gmail.com,betterassessoria@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contato" className="max-w-xl mx-auto pt-20">
      <h2 className="text-3xl font-semibold mb-4 text-center">Contato</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Seu nome"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Seu email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="message"
          placeholder="Sua mensagem"
          value={form.message}
          onChange={handleChange}
          className="w-full border p-2 rounded h-32"
          required
        />
        <button
          type="submit"
          className="w-full py-2 rounded bg-orange-500 text-white font-semibold"
        >
          Enviar
        </button>
      </form>
    </section>
  );
}
