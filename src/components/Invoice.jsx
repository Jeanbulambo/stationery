import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Invoice({ panier, total, onRemove }) {
  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Facture de vente - Papeterie", 14, 20);

    const tableRows = panier.map(item => [
      item.nom,
      item.quantite,
      item.prix.toFixed(2),
      (item.quantite * item.prix).toFixed(2),
    ]);

    doc.autoTable({
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
      <h5>Panier</h5>
      <table className="table">
        <thead><tr><th>Produit</th><th>Quantité</th><th>Prix</th><th>Total</th><th>Action</th></tr></thead>
        <tbody>
          {panier.map((item, index) => (
            <tr key={index}>
              <td>{item.nom}</td>
              <td>{item.quantite}</td>
              <td>{item.prix}</td>
              <td>{(item.quantite * item.prix).toFixed(2)}</td>
              <td>
                <button className="btn btn-sm btn-danger" onClick={() => onRemove(item.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h5>Total général : {total.toFixed(2)} $</h5>
    </div>
  );
}
