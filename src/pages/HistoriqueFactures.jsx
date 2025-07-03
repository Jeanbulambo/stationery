import React, { useEffect, useState } from 'react';
import { getAllItems } from '../services/indexedDB';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function HistoriqueFactures() {
  const [factures, setFactures] = useState([]);
  const [filtreDate, setFiltreDate] = useState('');

  useEffect(() => {
    getAllItems('factures').then(setFactures);
  }, []);

  const facturesFiltrées = filtreDate
    ? factures.filter(f => f.date.startsWith(filtreDate))
    : factures;

  const exporterPDF = () => {
    const doc = new jsPDF();
    doc.text('Historique des Factures', 14, 20);

    const rows = facturesFiltrées.flatMap(facture =>
      facture.panier.map(item => [
        facture.date.slice(0, 10),
        item.nom,
        item.quantite,
        item.prix,
        (item.quantite * item.prix).toFixed(2)
      ])
    );

    autoTable(doc, {
      head: [['Date', 'Produit', 'Quantité', 'Prix', 'Total']],
      body: rows,
      startY: 30
    });

    doc.save(`historique_factures.pdf`);
  };

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
            <button className="btn btn-outline-primary" onClick={exporterPDF}>
              Exporter PDF
            </button>
          </div>
        </div>

        {facturesFiltrées.length === 0 ? (
          <p className="text-muted">Aucune facture trouvée.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Produit</th>
                  <th>Quantité</th>
                  <th>Prix</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {facturesFiltrées.map((facture, index) =>
                  facture.panier.map((item, i) => (
                    <tr key={`${index}-${i}`}>
                      <td>{facture.date.slice(0, 10)}</td>
                      <td>{item.nom}</td>
                      <td>{item.quantite}</td>
                      <td>{item.prix}</td>
                      <td>{(item.quantite * item.prix).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
