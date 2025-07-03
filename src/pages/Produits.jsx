import React, { useEffect, useState } from 'react';
import { getAllItems, addItem, updateItem, deleteItem } from '../services/indexedDB';
import { addApprovisionnement } from '../services/indexedDB';
import * as XLSX from 'xlsx';

export default function Produits() {
  const [produits, setProduits] = useState([]);
  const [form, setForm] = useState({
    produitId: '',
    nom: '',
    prix: '',
    quantite: '',
    fournisseur: ''
  });

  useEffect(() => {
    chargerProduits();
  }, []);

  const chargerProduits = () => {
    getAllItems('produits').then(setProduits);
  };

  const afficherPrixUSD = (prix) => `${prix.toLocaleString('en-US', { minimumFractionDigits: 2 })} $`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { produitId, nom, prix, quantite, fournisseur } = form;

    if (!quantite || !fournisseur) return alert("Veuillez saisir la quantité et le fournisseur");

    const date = new Date().toISOString();

    if (produitId) {
      const produit = produits.find(p => p.id === parseInt(produitId));
      const nouveauStock = produit.stock + parseInt(quantite);
      await updateItem('produits', { ...produit, stock: nouveauStock });

      await addApprovisionnement({
        date,
        produitId: produit.id,
        produitNom: produit.nom,
        quantite: parseInt(quantite),
        fournisseur,
      });

      alert(`Approvisionnement de "${produit.nom}" effectué via ${fournisseur}`);
    } else {
      if (!nom || !prix) return alert("Veuillez remplir les champs du nouveau produit");

      const nouveauProduit = {
        nom,
        prix: parseFloat(prix),
        stock: parseInt(quantite)
      };

      const id = await addItem('produits', nouveauProduit);

      await addApprovisionnement({
        date,
        produitId: id,
        produitNom: nom,
        quantite: parseInt(quantite),
        fournisseur,
      });

      alert(`Produit "${nom}" ajouté avec approvisionnement via ${fournisseur}`);
    }

    setForm({ produitId: '', nom: '', prix: '', quantite: '', fournisseur: '' });
    chargerProduits();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce produit ?')) {
      await deleteItem('produits', id);
      chargerProduits();
    }
  };

  const handleUpdate = async (produit) => {
    const nouveauStock = prompt(`Modifier stock pour ${produit.nom}:`, produit.stock);
    if (nouveauStock === null) return;

    const nouveauPrix = prompt(`Modifier prix en USD pour ${produit.nom} (actuel: ${afficherPrixUSD(produit.prix)}):`, produit.prix);
    if (nouveauPrix === null) return;

    await updateItem('produits', {
      ...produit,
      stock: parseInt(nouveauStock),
      prix: parseFloat(nouveauPrix),
    });

    chargerProduits();
  };

  // ✅ Export Excel
  const exporterProduitsExcel = () => {
    const ws = XLSX.utils.json_to_sheet(produits);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Produits');
    XLSX.writeFile(wb, 'produits_export.xlsx');
  };

  // ✅ Import Excel avec validation et dédoublonnage
  const importerProduitsExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const produitsImportés = XLSX.utils.sheet_to_json(sheet);

      let ajoutés = 0, ignorés = 0;

      for (let produit of produitsImportés) {
        const nom = produit.nom?.trim();
        const prix = parseFloat(produit.prix);
        const stock = parseInt(produit.stock);

        if (!nom || isNaN(prix) || isNaN(stock)) {
          ignorés++;
          continue;
        }

        const existe = produits.find(p => p.nom.toLowerCase() === nom.toLowerCase());
        if (existe) {
          ignorés++;
          continue;
        }

        await addItem('produits', { nom, prix, stock });
        ajoutés++;
      }

      alert(`Import terminé : ${ajoutés} ajoutés, ${ignorés} ignorés`);
      chargerProduits();
    };
    reader.readAsArrayBuffer(file);
  };

  // ✅ Template Excel vide
  const telechargerTemplateExcel = () => {
    const donnees = [{ nom: '', prix: '', stock: '' }];
    const ws = XLSX.utils.json_to_sheet(donnees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'template_produits.xlsx');
  };

  return (
    <div className="container my-4">
      <h3 className="mb-4">🛒 Produits & Approvisionnement (en USD)</h3>

      <div className="mb-4">
        <label className="btn btn-outline-primary me-2">
          📥 Importer Excel
          <input type="file" accept=".xlsx, .xls" hidden onChange={importerProduitsExcel} />
        </label>
        <button className="btn btn-outline-success me-2" onClick={exporterProduitsExcel}>
          📤 Exporter Excel
        </button>
        <button className="btn btn-outline-secondary" onClick={telechargerTemplateExcel}>
          📄 Télécharger modèle Excel
        </button>
      </div>

      <form className="row g-3 align-items-end mb-4" onSubmit={handleSubmit}>
        <div className="col-12 col-md-3">
          <label className="form-label">Produit existant</label>
          <select
            className="form-select"
            value={form.produitId}
            onChange={(e) => setForm({ ...form, produitId: e.target.value, nom: '', prix: '' })}
          >
            <option value="">-- Nouveau produit --</option>
            {produits.map(p => (
              <option key={p.id} value={p.id}>{p.nom}</option>
            ))}
          </select>
        </div>

        {!form.produitId && (
          <>
            <div className="col-12 col-md-3">
              <label className="form-label">Nom du produit</label>
              <input
                type="text"
                className="form-control"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
              />
            </div>
            <div className="col-12 col-md-2">
              <label className="form-label">Prix (USD)</label>
              <input
                type="number"
                className="form-control"
                min="0"
                step="0.01"
                value={form.prix}
                onChange={(e) => setForm({ ...form, prix: e.target.value })}
              />
            </div>
          </>
        )}

        <div className="col-12 col-md-2">
          <label className="form-label">Quantité</label>
          <input
            type="number"
            className="form-control"
            min="1"
            value={form.quantite}
            onChange={(e) => setForm({ ...form, quantite: e.target.value })}
          />
        </div>

        <div className="col-12 col-md-2">
          <label className="form-label">Fournisseur</label>
          <input
            type="text"
            className="form-control"
            value={form.fournisseur}
            onChange={(e) => setForm({ ...form, fournisseur: e.target.value })}
          />
        </div>

        <div className="col-12 col-md-1 d-grid">
          <button type="submit" className="btn btn-success">
            Valider
          </button>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Nom</th>
              <th>Prix (USD)</th>
              <th>Stock</th>
              <th style={{ minWidth: '150px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {produits.map((p) => (
              <tr key={p.id}>
                <td>{p.nom}</td>
                <td>{afficherPrixUSD(p.prix)}</td>
                <td>
                  {p.stock <= 5 ? (
                    <span className="badge bg-danger">Stock faible: {p.stock}</span>
                  ) : (
                    p.stock
                  )}
                </td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleUpdate(p)}>
                    Modifier stock/prix
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {produits.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-muted">Aucun produit trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
