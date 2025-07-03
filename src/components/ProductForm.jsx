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
    <form className="row g-2 align-items-end mb-4" onSubmit={handleSubmit}>
      <div className="col-12 col-md-3">
        <input
          className="form-control"
          placeholder="Nom"
          value={nom}
          onChange={e => setNom(e.target.value)}
        />
      </div>
      <div className="col-6 col-md-3">
        <input
          className="form-control"
          type="number"
          placeholder="Prix"
          value={prix}
          onChange={e => setPrix(e.target.value)}
        />
      </div>
      <div className="col-6 col-md-3">
        <input
          className="form-control"
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={e => setStock(e.target.value)}
        />
      </div>
      <div className="col-12 col-md-3">
        <button className="btn btn-primary w-100" type="submit">Ajouter</button>
      </div>
    </form>
  );
}
