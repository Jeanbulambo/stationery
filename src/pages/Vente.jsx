import React, { useEffect, useState } from 'react';
import { getAllItems, updateItem } from '../services/indexedDB';
import { addFacture } from '../services/indexedDB';
import SaleForm from '../components/SaleForm';
import Invoice from '../components/Invoice';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Vente() {
  const [produits, setProduits] = useState([]);
  const [panier, setPanier] = useState([]);

  useEffect(() => {
    getAllItems('produits').then(setProduits);
  }, []);

  const ajouterAuPanier = (produitAjoute) => {
    const existe = panier.find(p => p.id === produitAjoute.id);
    if (existe) {
      setPanier(
        panier.map(p =>
          p.id === produitAjoute.id
            ? { ...p, quantite: p.quantite + produitAjoute.quantite }
            : p
        )
      );
    } else {
      setPanier([...panier, produitAjoute]);
    }
  };

  const supprimerDuPanier = (id) => {
    setPanier(panier.filter(p => p.id !== id));
  };

  const total = panier.reduce((sum, p) => sum + p.prix * p.quantite, 0);

  const enregistrerFacture = async () => {
    if (panier.length === 0) return alert('Le panier est vide');

    await addFacture({ panier, total, date: new Date().toISOString() });

    for (let item of panier) {
      const produit = produits.find(p => p.id === item.id);
      const nouveauStock = produit.stock - item.quantite;
      await updateItem('produits', { ...produit, stock: nouveauStock });
    }

    setPanier([]);
    getAllItems('produits').then(setProduits);
    alert('Facture enregistrée.');
  };

  const exporterPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Facture de vente - Papeterie", 14, 20);

    const tableRows = panier.map(item => [
      item.nom,
      item.quantite,
      item.prix.toFixed(2),
      (item.quantite * item.prix).toFixed(2),
    ]);

    autoTable(doc, {
      head: [['Produit', 'Quantité', 'Prix', 'Total']],
      body: tableRows,
      startY: 30,
    });

    doc.text(`Total général : ${total.toFixed(2)} $`, 14, doc.lastAutoTable.finalY + 10);
    const date = new Date().toISOString().slice(0, 10);
    doc.save(`facture_${date}.pdf`);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Vente</h2>
        <div>
          <button className="btn btn-outline-primary me-2" onClick={exporterPDF}>
            Exporter la facture en PDF
          </button>
          <button className="btn btn-success" onClick={enregistrerFacture}>
            Enregistrer la facture
          </button>
        </div>
      </div>

      <SaleForm produits={produits} onAdd={ajouterAuPanier} />
      <Invoice panier={panier} total={total} onRemove={supprimerDuPanier} />
    </div>
  );
}
