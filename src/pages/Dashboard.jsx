// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { getAllProduits, getApprovisionnements, getAllItems } from '../services/indexedDB';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

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

      const today = new Date().toISOString().split('T')[0];
      setDateDebut(today);
      setDateFin(today);

      const ventesDuJour = ventesData.filter(v => v.date?.startsWith(today));
      setFiltreVentes(ventesDuJour);
    })();
  }, []);

  const appliquerFiltre = () => {
    if (!dateDebut || !dateFin) return;

    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    fin.setHours(23, 59, 59);

    const filtrées = ventes.filter(v => {
      const dateVente = new Date(v.date);
      return dateVente >= debut && dateVente <= fin;
    });
    setFiltreVentes(filtrées);
  };

  const totalVentesFiltrées = filtreVentes.reduce((total, f) => total + (f.total || 0), 0);

  const exporterPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Liste des ventes filtrées', 14, 20);

    const rows = filtreVentes.map(f => [f.numero, f.client, new Date(f.date).toLocaleString(), `${f.total} ${f.devise}`]);
    autoTable(doc, {
      startY: 30,
      head: [['N° Facture', 'Client', 'Date', 'Montant']],
      body: rows,
    });

    doc.save('ventes_filtrees.pdf');
  };

  const exporterExcel = () => {
    const data = filtreVentes.map(f => ({
      'N° Facture': f.numero,
      'Client': f.client,
      'Date': new Date(f.date).toLocaleString(),
      'Montant': `${f.total} ${f.devise}`,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ventes');
    XLSX.writeFile(wb, 'ventes_filtrees.xlsx');
  };

  return (
    <div className="container">
      <h2 className="mb-4">📊 Tableau de bord – Bienvenue {user?.username}</h2>

      <div className="row mb-4 align-items-end">
        <div className="col-md-3">
          <label className="form-label">Date début</label>
          <input type="date" className="form-control" value={dateDebut} onChange={e => setDateDebut(e.target.value)} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Date fin</label>
          <input type="date" className="form-control" value={dateFin} onChange={e => setDateFin(e.target.value)} />
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary w-100 mt-3" onClick={appliquerFiltre}>🔍 Filtrer</button>
        </div>
        <div className="col-md-3 d-flex gap-2 mt-3">
          <button className="btn btn-outline-secondary w-50" onClick={exporterPDF}>📄 PDF</button>
          <button className="btn btn-outline-success w-50" onClick={exporterExcel}>📊 Excel</button>
        </div>
      </div>

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

      <h5 className="mt-5">📋 Liste des factures filtrées</h5>
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
          {filtreVentes.map((f, i) => (
            <tr key={i}>
              <td>{f.numero}</td>
              <td>{f.client}</td>
              <td>{new Date(f.date).toLocaleString()}</td>
              <td>{f.total.toLocaleString()}</td>
              <td>{f.devise}</td>
            </tr>
          ))}
          {filtreVentes.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-muted">Aucune facture trouvée</td>
            </tr>
          )}
        </tbody>
      </table>

      <h4 className="mt-5">📦 Derniers approvisionnements</h4>
      <table className="table table-sm table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>Date</th>
            <th>Produit</th> {/* ⬅️ Changement ici */}
            <th>Quantité</th>
          </tr>
        </thead>
        <tbody>
          {appros.map((a, i) => (
            <tr key={i}>
              <td>{a.date || 'N/A'}</td>
              <td>{produits.find(p => p.id === a.produitId)?.nom || a.produitId}</td>
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
