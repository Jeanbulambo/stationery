import React, { useEffect, useState } from 'react';
import { getAllProduits, getApprovisionnements, getAllItems } from '../services/indexedDB';

export default function Dashboard({ user }) {
  const [produits, setProduits] = useState([]);
  const [appros, setAppros] = useState([]);
  const [ventes, setVentes] = useState([]);
  const [filtreVentes, setFiltreVentes] = useState([]);

  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');

  useEffect(() => {
    (async () => {
      const produitsData = await getAllProduits();
      const approsData = await getApprovisionnements();
      const ventesData = await getAllItems('factures');

      setProduits(produitsData);
      setAppros(approsData.slice(-5));
      setVentes(ventesData);
      setFiltreVentes(ventesData); // par défaut = tout
    })();
  }, []);

  const appliquerFiltre = () => {
    if (!dateDebut || !dateFin) {
      setFiltreVentes(ventes);
      return;
    }

    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    fin.setHours(23, 59, 59); // inclure toute la journée

    const filtrées = ventes.filter(v => {
      const dateVente = new Date(v.date);
      return dateVente >= debut && dateVente <= fin;
    });

    setFiltreVentes(filtrées);
  };

  const totalVentesFiltrées = filtreVentes.reduce((total, f) => total + (f.total || 0), 0);

  return (
    <div className="container">
      <h2 className="mb-4">📊 Tableau de bord – Bienvenue {user?.username}</h2>

      {/* Filtres par date */}
      <div className="row mb-4 align-items-end">
        <div className="col-md-4">
          <label className="form-label">Date début</label>
          <input type="date" className="form-control" value={dateDebut} onChange={e => setDateDebut(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Date fin</label>
          <input type="date" className="form-control" value={dateFin} onChange={e => setDateFin(e.target.value)} />
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary w-100 mt-3" onClick={appliquerFiltre}>
            🔍 Filtrer
          </button>
        </div>
      </div>

      {/* Cartes */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary shadow-sm">
            <div className="card-body">
              <h5 className="card-title">🛒 Produits en stock</h5>
              <p className="card-text display-6">{produits.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success shadow-sm">
            <div className="card-body">
              <h5 className="card-title">💰 Ventes filtrées</h5>
              <p className="card-text display-6">{totalVentesFiltrées.toLocaleString()} FC</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-warning shadow-sm">
            <div className="card-body">
              <h5 className="card-title">🧾 Factures filtrées</h5>
              <p className="card-text display-6">{filtreVentes.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Derniers approvisionnements */}
      <h4 className="mt-5">📦 Derniers approvisionnements</h4>
      <table className="table table-sm table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>Date</th>
            <th>Produit ID</th>
            <th>Quantité</th>
          </tr>
        </thead>
        <tbody>
          {appros.map((a, i) => (
            <tr key={i}>
              <td>{a.date || 'N/A'}</td>
              <td>{a.produitId}</td>
              <td>{a.quantite}</td>
            </tr>
          ))}
          {appros.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center text-muted">Aucun approvisionnement</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
