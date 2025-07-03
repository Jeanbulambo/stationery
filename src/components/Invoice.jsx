import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { addFacture, updateItem, getAllItems } from '../services/indexedDB';
import logo from '../assets/logoktw.jpeg';
import signature from '../assets/signature.png';
import nombreEnLettres from '../utils/numberToWords';

function Invoice({
  panier,
  total,
  onRemove,
  devise = 'FC',
  tauxFC = 2700,
  produits,
  setProduits,
  viderPanier,
}) {
  const [nomClient, setNomClient] = useState('');

  const afficherMontant = (montant) =>
    devise === 'FC'
      ? `${(montant * tauxFC).toLocaleString('de-DE')} FC`
      : `${montant.toLocaleString('en-US', { minimumFractionDigits: 2 })} $`;

  const genererNumeroFacture = () => {
    const date = new Date();
    return `F-${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${Date.now().toString().slice(-4)}`;
  };

  const montantEnLettre = () => {
    const montant = devise === 'FC' ? total * tauxFC : total;
    return nombreEnLettres(montant, devise);
  };

  const handleExportPDF = async () => {
    if (panier.length === 0) return alert('Le panier est vide.');

    const doc = new jsPDF();
    const numeroFacture = genererNumeroFacture();
    const date = new Date().toLocaleDateString('fr-CD');

    doc.addImage(logo, 'JPEG', 150, 10, 45, 25);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Walikale to World', 14, 20);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('DRC, Nord Kivu, Walikale', 14, 25);
    doc.text('N° RCCM : CD/GOM/RCCM/24-A-01041', 14, 30);
    doc.text('Id.NAT : 01-G4701-N66253Q', 14, 35);
    doc.text('N° Impôt : 01-G4701-N66', 14, 40);
    doc.text('Phone : +243 812 681 339', 14, 45);
    doc.text('Email : walikaletoworld.rt@gmail.com', 14, 50);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURE DE VENTE', 105, 65, { align: 'center' });

    let y = 75;
    doc.setFontSize(10);
    doc.text(`Facture N° : ${numeroFacture}`, 14, y);
    doc.text(`Date : ${date}`, 150, y);
    y += 7;
    doc.text(`Client : ${nomClient || 'Visiteur'}`, 14, y);
    if (devise === 'FC') {
      y += 6;
      doc.text(`Taux appliqué : 1 USD = ${tauxFC.toLocaleString('fr-CD')} FC`, 14, y);
    }
    y += 8;

    const tableRows = panier.map((item, i) => [
      i + 1,
      item.nom,
      item.quantite,
      'pcs',
      afficherMontant(item.prix),
      afficherMontant(item.prix * item.quantite),
    ]);

    autoTable(doc, {
      head: [['#', 'Article', 'Quantité', 'Unité', 'Prix U.', 'Total']],
      body: tableRows,
      startY: y,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    const totalText = afficherMontant(total);
    const xRight = 150;

    doc.setFontSize(10);
    doc.text(`Sub Total : ${totalText}`, xRight, finalY);
    doc.text(`Total     : ${totalText}`, xRight, finalY + 5);

    doc.text(`Montant en lettres :`, 14, finalY + 22);
    doc.text(montantEnLettre(), 14, finalY + 27);

    const pageHeight = doc.internal.pageSize.height;
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text('Merci pour votre confiance !', 14, pageHeight - 25);
    doc.text('Papeterie Walikale to World', 14, pageHeight - 20);
    doc.text('Email : walikaletoworld.rt@gmail.com', 14, pageHeight - 15);

    // ✅ Signature + libellé "Signature pour autorisation"
    doc.setFontSize(10);
    doc.text('Signature pour autorisation :', 150, pageHeight - 42);
    doc.addImage(signature, 'PNG', 150, pageHeight - 40, 50, 25);

    // ✅ Enregistrement facture + MAJ stock
    await addFacture({
      numero: numeroFacture,
      client: nomClient,
      panier,
      total,
      devise,
      tauxFC: devise === 'FC' ? tauxFC : null,
      date: new Date().toISOString(),
    });

    for (let item of panier) {
      const produit = produits.find(p => p.id === item.id);
      if (produit) {
        const nouveauStock = produit.stock - item.quantite;
        await updateItem('produits', { ...produit, stock: nouveauStock });
      }
    }

    const produitsMaj = await getAllItems('produits');
    setProduits(produitsMaj);
    viderPanier();

    doc.save(`facture_${numeroFacture}.pdf`);
  };

  return (
    <div className="container my-4">
      <div className="row g-3 align-items-center mb-3">
        <div className="col-md-6">
          <label className="form-label">Nom du client</label>
          <input
            type="text"
            className="form-control"
            value={nomClient}
            onChange={(e) => setNomClient(e.target.value)}
            placeholder="Ex : Jean K."
          />
        </div>
        <div className="col-md-6 text-md-end mt-3 mt-md-0">
          <button className="btn btn-success" onClick={handleExportPDF}>
            📄 Exporter en PDF
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Prix unitaire</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {panier.map((item, index) => (
              <tr key={index}>
                <td>{item.nom}</td>
                <td>{item.quantite}</td>
                <td>{afficherMontant(item.prix)}</td>
                <td>{afficherMontant(item.prix * item.quantite)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onRemove(item.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {panier.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  Aucun produit dans le panier
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h5 className="mt-4">
        Total général : {afficherMontant(total)}
      </h5>
    </div>
  );
}

export default Invoice;
