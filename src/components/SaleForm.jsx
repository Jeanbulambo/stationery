// 📁 src/components/SaleForm.jsx
import React, { useState } from 'react';

export default function SaleForm({ produits, onAdd }) {
  const [selectedId, setSelectedId] = useState('');
  const [quantite, setQuantite] = useState(1);

  const ajouter = () => {
    const produit = produits.find(p => p.id === parseInt(selectedId));
    if (produit && quantite > 0) {
      onAdd({ ...produit, quantite });
      setQuantite(1);
      setSelectedId('');
    }
  };

  return (
    <div className="d-flex mb-3">
      <select className="form-select me-2" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
        <option value="">-- Sélectionner un produit --</option>
        {produits.map(p => (
          <option key={p.id} value={p.id}>{p.nom} ({p.stock} en stock)</option>
        ))}
      </select>
      <input className="form-control me-2" type="number" min={1} value={quantite} onChange={e => setQuantite(Number(e.target.value))} />
      <button className="btn btn-primary" onClick={ajouter}>Ajouter</button>
    </div>
  );
}
