import React, { useEffect, useState } from 'react';
import { getAllItems } from '../services/indexedDB';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function HistoriqueFactures() {
  const [factures, setFactures] = useState([]);
  const [filtreDate, setFiltreDate] = useState('');
  const [filtreClient, setFiltreClient] = useState('');
  const [page, setPage] = useState(1);
  const lignesParPage = 10;

  useEffect(() => {
    getAllItems('factures').then(setFactures);
  }, []);

  const clientsUniques = [...new Set(factures.map(f => f.client).filter(Boolean))];

  const facturesFiltrées = factures.filter(f => {
    const filtreParDate = filtreDate ? f.date.startsWith(filtreDate) : true;
    const filtreParClient = filtreClient ? f.client === filtreClient : true;
    return filtreParDate && filtreParClient;
  });

  const lignes = facturesFiltrées.flatMap(facture =>
    facture.panier.map(item => ({
      date: facture.date.slice(0, 10),
      client: facture.client || 'Inconnu',
      nom: item.nom,
      quantite: item.quantite,
      prix: item.prix,
      total: (item.quantite * item.prix).toFixed(2)
    }))
  );

  const totalPages = Math.ceil(lignes.length / lignesParPage);
  const lignesAffichées = lignes.slice((page - 1) * lignesParPage, page * lignesParPage);

  const exporterPDF = () => {
    const doc = new jsPDF();
    doc.text('Historique des Factures', 14, 20);

    const rows = lignes.map(l => [
      l.date,
      l.client,
      l.nom,
      l.quantite,
      l.prix,
      l.total
    ]);

    autoTable(doc, {
      head: [['Date', 'Client', 'Produit', 'Quantité', 'Prix', 'Total']],
      body: rows,
      startY: 30
    });

    doc.save(`historique_factures.pdf`);
  };

  const handlePageChange = (direction) => {
    if (direction === 'prev' && page > 1) {
      setPage(page - 1);
    } else if (direction === 'next' && page < totalPages) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    setPage(1); // Réinitialiser la page quand un filtre change
  }, [filtreDate, filtreClient]);

  return (
    <div className="container my-4">
      <div className="card p-3">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3">
          <h4 className="mb-0">🧾 Historique des factures</h4>

          <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
            <input
              type="date"
              className="form-control"
              value={filtreDate}
              onChange={(e) => setFiltreDate(e.target.value)}
            />
            <select
              className="form-select"
              value={filtreClient}
              onChange={(e) => setFiltreClient(e.target.value)}
            >
              <option value="">-- Tous les clients --</option>
              {clientsUniques.map((client, index) => (
                <option key={index} value={client}>{client}</option>
              ))}
            </select>
            <button className="btn btn-outline-primary" onClick={exporterPDF}>
              Exporter PDF
            </button>
          </div>
        </div>

        {lignesAffichées.length === 0 ? (
          <p className="text-muted">Aucune facture trouvée.</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Client</th>
                    <th>Produit</th>
                    <th>Quantité</th>
                    <th>Prix</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lignesAffichées.map((l, i) => (
                    <tr key={i}>
                      <td>{l.date}</td>
                      <td>{l.client}</td>
                      <td>{l.nom}</td>
                      <td>{l.quantite}</td>
                      <td>{l.prix}</td>
                      <td>{l.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => handlePageChange('prev')}
                disabled={page === 1 || totalPages === 0}
              >
                ◀ Précédent
              </button>
              <span>Page {page} / {totalPages || 1}</span>
              <button
                className="btn btn-outline-secondary"
                onClick={() => handlePageChange('next')}
                disabled={page === totalPages || totalPages === 0}
              >
                Suivant ▶
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
