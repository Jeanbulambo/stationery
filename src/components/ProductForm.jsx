import React, { useState } from 'react';

export default function ProductForm({ onAdd }) {
  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState('');
  const [stock, setStock] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nom || !prix || !stock) return;
    onAdd({ nom, prix: Number(prix), stock: Number(stock) });
    setNom(''); setPrix(''); setStock('');
  };

  return (
    <form className="d-flex mb-3" onSubmit={handleSubmit}>
      <input className="form-control me-2" placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} />
      <input className="form-control me-2" type="number" placeholder="Prix" value={prix} onChange={e => setPrix(e.target.value)} />
      <input className="form-control me-2" type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} />
      <button className="btn btn-primary" type="submit">Ajouter</button>
    </form>
  );
}