import React, { useEffect, useState } from 'react';
import { getAllItems, addItem } from '../services/indexedDB';
import ProductForm from '../components/ProductForm';

export default function Produits() {
  const [produits, setProduits] = useState([]);

  const chargerProduits = () => getAllItems('produits').then(setProduits);
  useEffect(() => { chargerProduits(); }, []);

  const ajouterProduit = (produit) => {
    addItem('produits', produit).then(chargerProduits);
  };

  return (
    <div>
      <h2>Produits</h2>
      <ProductForm onAdd={ajouterProduit} />
      <table className="table">
        <thead><tr><th>Nom</th><th>Prix</th><th>Stock</th></tr></thead>
        <tbody>
          {produits.map(p => (
            <tr key={p.id}><td>{p.nom}</td><td>{p.prix}</td><td>{p.stock}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}