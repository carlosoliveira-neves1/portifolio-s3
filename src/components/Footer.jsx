// src/components/Footer.jsx
// ---------------------------------------
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 mt-12">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} B2 Engenharia e Construção. Todos os direitos reservados.
      </div>
    </footer>
  );
}