// src/pages/Admin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: '',
    description: '',
    status: 'Realizada',
    images: []
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const navigate = useNavigate();

  // 1. Carrega JSON de projetos do S3
  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data || []))
      .catch(console.error);
  }, []);

  // 2. Gera previews locais
  useEffect(() => {
    if (!files.length) {
      setPreviews([]);
      return;
    }
    const prs = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        prs.push(reader.result);
        if (prs.length === files.length) {
          setPreviews(prs);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [files]);

  const resetForm = () => {
    setForm({ id: null, title: '', description: '', status: 'Realizada', images: [] });
    setFiles([]);
    setPreviews([]);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Upload de cada arquivo e coleta publicURL
    const newUrls = await Promise.all(
      files.map(async file => {
        const { uploadURL, publicURL } = await fetch('/api/sign-s3', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, filetype: file.type })
        }).then(r => r.json());
        await fetch(uploadURL, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file
        });
        return publicURL;
      })
    );

    // Atualiza o array de projetos
    const updated = form.id
      ? projects.map(p =>
          p.id === form.id
            ? { ...form, images: [...(form.images || []), ...newUrls] }
            : p
        )
      : [
          ...projects,
          { ...form, id: Date.now(), images: newUrls }
        ];

    // Grava de volta no S3
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });

    setProjects(updated);
    resetForm();
    alert('Projeto salvo!');
    navigate('/portfolio');
  };

  const handleEdit = project => {
    setForm({
      id: project.id,
      title: project.title,
      description: project.description,
      status: project.status,
      images: project.images || []
    });
    setPreviews(project.images || []);
    setFiles([]);
  };

  const handleDelete = async id => {
    if (!window.confirm('Deseja excluir este projeto?')) return;
    const filtered = projects.filter(p => p.id !== id);
    // grava o novo array sem o projeto excluído
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filtered)
    });
    setProjects(filtered);
  };

  return (
    <section className="pt-20 max-w-3xl mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-6">
        {form.id ? 'Editar Projeto' : 'Adicionar Projeto'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Título do Projeto"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Descrição"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="w-full border p-2 rounded h-24"
          required
        />
        <select
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option>Realizada</option>
          <option>Em Andamento</option>
        </select>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={e => setFiles(Array.from(e.target.files))}
          className="w-full"
        />
        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {previews.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Preview ${idx + 1}`}
                className="w-full h-24 object-cover rounded"
              />
            ))}
          </div>
        )}
        <div className="flex space-x-3">
          <button
            type="submit"
            className="flex-grow py-2 bg-orange-500 text-white rounded"
          >
            {form.id ? 'Atualizar Projeto' : 'Adicionar Projeto'}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="py-2 px-4 bg-gray-300 rounded"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3 className="text-xl font-semibold mb-4">Projetos Cadastrados</h3>
      <div className="space-y-4">
        {projects.map(p => (
          <div
            key={p.id}
            className="flex items-center space-x-4 border p-4 rounded"
          >
            <div className="grid grid-cols-3 gap-1 flex-shrink-0">
              {(p.images || []).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${p.title} ${i + 1}`}
                  className="w-16 h-16 object-cover rounded"
                />
              ))}
            </div>
            <div className="flex-grow">
              <h4 className="font-semibold">{p.title}</h4>
              <p className="text-sm text-gray-600">{p.status}</p>
            </div>
            <button
              onClick={() => handleEdit(p)}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(p.id)}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
