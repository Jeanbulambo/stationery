import React, { useState } from 'react';

export default function SaleForm({ produits, onAdd }) {
  const [produitId, setProduitId] = useState('');
  const [quantite, setQuantite] = useState(1);

  const handleAdd = () => {
    const produit = produits.find(p => p.id === parseInt(produitId));
    if (!produit) return alert('Veuillez sélectionner un produit');

    if (quantite <= 0) {
      return alert('Quantité invalide');
    }

    if (quantite > produit.stock) {
      return alert(`Stock insuffisant. Stock disponible : ${produit.stock}`);
    }

    onAdd({ ...produit, quantite: parseInt(quantite) });
    setProduitId('');
    setQuantite(1);
  };

  return (
    <div className="card p-3 mb-4">
      <h5 className="mb-3">🛍 Ajouter au panier</h5>
      <div className="row g-2 align-items-end">
        <div className="col-12 col-md-5">
          <select
            className="form-select"
            value={produitId}
            onChange={(e) => setProduitId(e.target.value)}
          >
            <option value="">-- Sélectionner un produit --</option>
            {produits.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nom} (Stock: {p.stock})
              </option>
            ))}
          </select>
        </div>

        <div className="col-6 col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Quantité"
            value={quantite}
            onChange={(e) => setQuantite(e.target.value)}
            min="1"
          />
        </div>

        <div className="col-6 col-md-4">
          <button className="btn btn-primary w-100" onClick={handleAdd}>
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
