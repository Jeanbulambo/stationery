import React, { useEffect, useState } from 'react';
import { getAllProduits, getApprovisionnements, getAllItems } from '../services/indexedDB';

export default function Dashboard({ user }) {
  const [produits, setProduits] = useState([]);
  const [appros, setAppros] = useState([]);
  const [ventes, setVentes] = useState([]);
  const [filtreVentes, setFiltreVentes] = useState([]);
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');

  const [pageFactures, setPageFactures] = useState(1);
  const [pageAppros, setPageAppros] = useState(1);
  const lignesParPage = 3;

  useEffect(() => {
    (async () => {
      const produitsData = await getAllProduits();
      const approsData = await getApprovisionnements();
      const ventesData = await getAllItems('factures');

      setProduits(produitsData);
      setAppros(approsData);
      setVentes(ventesData);

      const today = new Date().toISOString().split('T')[0];
      setDateDebut(today);
      setDateFin(today);

      const ventesDuJour = ventesData.filter(v => v.date?.startsWith(today));
      setFiltreVentes(ventesDuJour);
    })();
  }, []);

  const appliquerFiltre = (e) => {
    if (e) e.preventDefault();

    if (!dateDebut || !dateFin) return;

    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    fin.setHours(23, 59, 59);

    const filtrées = ventes.filter(v => {
      const dateVente = new Date(v.date);
      return dateVente >= debut && dateVente <= fin;
    });
    setFiltreVentes(filtrées);
    setPageFactures(1);
  };

  const totalVentesFiltrées = filtreVentes.reduce((total, f) => total + (f.total || 0), 0);
  const totalVentesGlobales = ventes.reduce((total, f) => total + (f.total || 0), 0);

  const totalPagesFactures = Math.ceil(filtreVentes.length / lignesParPage);
  const facturesAffichees = filtreVentes.slice(
    (pageFactures - 1) * lignesParPage,
    pageFactures * lignesParPage
  );

  const totalPagesAppros = Math.ceil(appros.length / lignesParPage);
  const approsAffiches = appros.slice(
    (pageAppros - 1) * lignesParPage,
    pageAppros * lignesParPage
  );

  return (
    <div className="container my-4">

      {/* Filtres date */}
      <form className="card p-3 mb-4" onSubmit={appliquerFiltre}>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-5">
            <label htmlFor="dateDebut" className="form-label">Date début</label>
            <input
              id="dateDebut"
              type="date"
              className="form-control"
              value={dateDebut}
              onChange={e => setDateDebut(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-5">
            <label htmlFor="dateFin" className="form-label">Date fin</label>
            <input
              id="dateFin"
              type="date"
              className="form-control"
              value={dateFin}
              onChange={e => setDateFin(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-2 d-grid">
            <button type="submit" className="btn btn-primary">
              Appliquer filtre
            </button>
          </div>
        </div>
      </form>

      {/* Statistiques globales */}
      <h5 className="mb-2">📊 Statistiques globales</h5>
      <div className="row row-cols-1 row-cols-md-4 g-3 mb-4">
        <div className="col">
          <div className="card text-center p-3 h-100">
            <div className="fs-2 mb-2">📦</div>
            <h6>Total produits</h6>
            <p className="fs-4 fw-bold">{produits.length}</p>
          </div>
        </div>
        <div className="col">
          <div className="card text-center p-3 h-100">
            <div className="fs-2 mb-2">📥</div>
            <h6>Total approvisionnements</h6>
            <p className="fs-4 fw-bold">{appros.length}</p>
          </div>
        </div>
        <div className="col">
          <div className="card text-center p-3 h-100">
            <div className="fs-2 mb-2">🧾</div>
            <h6>Total factures</h6>
            <p className="fs-4 fw-bold">{ventes.length}</p>
          </div>
        </div>
        <div className="col">
          <div className="card text-center p-3 h-100">
            <div className="fs-2 mb-2">💰</div>
            <h6>Montant total factures</h6>
            <p className="fs-4 fw-bold">{totalVentesGlobales.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Statistiques filtrées */}
      <h5 className="mb-2">📆 Statistiques filtrées</h5>
      <div className="row row-cols-1 row-cols-md-4 g-3 mb-4">
        <div className="col">
          <div className="card text-center p-3 h-100">
            <div className="fs-2 mb-2">🧾</div>
            <h6>Factures filtrées</h6>
            <p className="fs-4 fw-bold">{filtreVentes.length}</p>
          </div>
        </div>
        <div className="col">
          <div className="card text-center p-3 h-100">
            <div className="fs-2 mb-2">💰</div>
            <h6>Montant total filtré</h6>
            <p className="fs-4 fw-bold">{totalVentesFiltrées.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Liste des factures filtrées */}
      <div className="card p-3 mb-4">
        <h5>📋 Liste des factures filtrées</h5>
        <div className="table-responsive">
          <table className="table table-bordered table-sm mt-3">
            <thead className="table-light">
              <tr>
                <th>N°</th>
                <th>Client</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Devise</th>
              </tr>
            </thead>
            <tbody>
              {facturesAffichees.length > 0 ? facturesAffichees.map((f, i) => (
                <tr key={i}>
                  <td>{f.numero}</td>
                  <td>{f.client}</td>
                  <td>{new Date(f.date).toLocaleString()}</td>
                  <td>{f.total.toLocaleString()}</td>
                  <td>{f.devise}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">Aucune facture trouvée</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex gap-2 mt-3">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setPageFactures(Math.max(pageFactures - 1, 1))}
            disabled={pageFactures === 1}
          >
            Voir moins
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={() => setPageFactures(Math.min(pageFactures + 1, totalPagesFactures))}
            disabled={pageFactures === totalPagesFactures}
          >
            Voir plus
          </button>
        </div>
      </div>

      {/* Derniers approvisionnements */}
      <div className="card p-3 mb-4">
        <h4>📦 Derniers approvisionnements</h4>
        <div className="table-responsive mt-3">
          <table className="table table-sm table-bordered">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Produit</th>
                <th>Quantité</th>
              </tr>
            </thead>
            <tbody>
              {approsAffiches.length > 0 ? approsAffiches.map((a, i) => (
                <tr key={i}>
                  <td>{a.date || 'N/A'}</td>
                  <td>{produits.find(p => p.id === a.produitId)?.nom || a.produitId}</td>
                  <td>{a.quantite}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted">Aucun approvisionnement</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex gap-2 mt-3">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setPageAppros(Math.max(pageAppros - 1, 1))}
            disabled={pageAppros === 1}
          >
            Voir moins
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={() => setPageAppros(Math.min(pageAppros + 1, totalPagesAppros))}
            disabled={pageAppros === totalPagesAppros}
          >
            Voir plus
          </button>
        </div>
      </div>
    </div>
  );
}
