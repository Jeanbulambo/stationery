import React, { useEffect, useState } from 'react';
import { getApprovisionnements, getAllProduits } from '../services/indexedDB';

export default function HistoriqueApprovisionnements() {
  const [approvisionnements, setApprovisionnements] = useState([]);
  const [produits, setProduits] = useState([]);
  const [filtreProduit, setFiltreProduit] = useState('');
  const [filtreFournisseur, setFiltreFournisseur] = useState('');

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    const data = await getApprovisionnements();
    const allProduits = await getAllProduits();
    setApprovisionnements(data);
    setProduits(allProduits);
  };

  const getNomProduit = (id) => {
    const produit = produits.find(p => p.id === id);
    return produit ? produit.nom : 'Inconnu';
  };

  const approFiltres = approvisionnements.filter((a) => {
    const filtreParProduit = filtreProduit ? a.produitId === parseInt(filtreProduit) : true;
    const filtreParFournisseur = filtreFournisseur ? a.fournisseur.toLowerCase().includes(filtreFournisseur.toLowerCase()) : true;
    return filtreParProduit && filtreParFournisseur;
  });

  return (
    <div className="container my-4">
      <div className="card p-3">
        <h4 className="mb-3">📦 Historique des approvisionnements</h4>

        {/* Filtres */}
        <div className="row g-2 mb-3">
          <div className="col-12 col-md-6">
            <select
              className="form-select"
              value={filtreProduit}
              onChange={(e) => setFiltreProduit(e.target.value)}
            >
              <option value="">-- Filtrer par produit --</option>
              {produits.map((p) => (
                <option key={p.id} value={p.id}>{p.nom}</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Filtrer par fournisseur"
              value={filtreFournisseur}
              onChange={(e) => setFiltreFournisseur(e.target.value)}
            />
          </div>
        </div>

        {/* Tableau */}
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Fournisseur</th>
              </tr>
            </thead>
            <tbody>
              {approFiltres.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">Aucun approvisionnement trouvé.</td>
                </tr>
              ) : (
                approFiltres.map((a) => (
                  <tr key={a.id}>
                    <td>{a.date || 'Non spécifiée'}</td>
                    <td>{getNomProduit(a.produitId)}</td>
                    <td>{a.quantite}</td>
                    <td>{a.fournisseur}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
