// src/components/Portfolio.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import localforage from 'localforage';

export default function Portfolio() {
  const [filter, setFilter] = useState('Todos');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomedImage, setZoomedImage] = useState(null);

  useEffect(() => {
    async function loadAll() {
      let external = [];
      try {
        const res = await fetch('/api/projects');
        external = await res.json();
      } catch {}
      const stored = (await localforage.getItem('projects')) || [];
      setProjects([...external, ...stored]);
    }
    loadAll();
  }, []);

  const filtered = projects.filter(
    p => filter === 'Todos' || p.status === filter
  );

  const openModal = project => {
    setSelectedProject(project);
    setSelectedIndex(0);
  };
  const closeModal = () => {
    setSelectedProject(null);
    setZoomedImage(null);
  };

  return (
    <section id="portfolio" className="pt-20">
      <div className="flex justify-center mb-6 space-x-4">
        {['Todos', 'Realizada', 'Em Andamento'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded ${filter === f ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum projeto encontrado.</p>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <motion.div
              key={p.id}
              className="border rounded-lg overflow-hidden shadow hover:shadow-lg cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => openModal(p)}
            >
              <div className="h-48 bg-gray-100 flex">
                {(p.images || []).slice(0, 2).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={p.title}
                    className="w-1/2 h-full object-cover"
                  />
                ))}
                {(p.images || []).length > 2 && (
                  <div className="w-1/2 h-full flex items-center justify-center bg-black bg-opacity-20 text-white text-xl">
                    +{(p.images || []).length - 2}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
                <span className="inline-block px-2 py-1 text-sm rounded-full bg-orange-100 text-orange-700 mb-2">
                  {p.status}
                </span>
                <p className="text-gray-600 text-sm line-clamp-2">{p.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={closeModal}
            />
            <motion.div
              className="relative bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] flex"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              {/* Galeria e thumbnails */}
              <div className="flex-1 p-4 flex flex-col min-h-0">
                <div className="flex-1 overflow-auto flex items-center justify-center">
                  <img
                    src={selectedProject.images[selectedIndex]}
                    alt={`${selectedProject.title} ${selectedIndex + 1}`}
                    className="max-h-full max-w-full object-contain cursor-zoom-in"
                    onClick={() => setZoomedImage(selectedProject.images[selectedIndex])}
                  />
                </div>
                <div className="flex-shrink-0 flex space-x-2 mt-2 overflow-x-auto">
                  {(selectedProject.images || []).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${selectedProject.title} thumb ${i + 1}`}
                      onClick={() => setSelectedIndex(i)}
                      className={`w-16 h-16 object-cover cursor-pointer rounded ${i === selectedIndex ? 'ring-2 ring-orange-500' : ''}`}
                    />
                  ))}
                </div>
              </div>

              {/* Descrição */}
              <div className="w-1/3 border-l p-6 overflow-y-auto">
                <h2 className="text-2xl font-semibold mb-4">{selectedProject.title}</h2>
                <span className="inline-block px-2 py-1 text-sm rounded-full bg-orange-100 text-orange-700 mb-4">
                  {selectedProject.status}
                </span>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedProject.description}
                </p>
              </div>

              {/* Botão fechar */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
              >
                &times;
              </button>

              {/* Lightbox Zoom */}
              {zoomedImage && (
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setZoomedImage(null)}
                >
                  <motion.img
                    src={zoomedImage}
                    alt="Zoomed"
                    className="max-h-full max-w-full object-contain"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                  />
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
