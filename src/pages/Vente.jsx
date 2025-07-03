import React, { useEffect, useState } from 'react';
import { getAllItems } from '../services/indexedDB';
import SaleForm from '../components/SaleForm';
import Invoice from '../components/Invoice';

export default function Vente() {
  const [produits, setProduits] = useState([]);
  const [panier, setPanier] = useState([]);
  const [devise, setDevise] = useState(localStorage.getItem('devise') || 'USD');
  const [tauxFC, setTauxFC] = useState(Number(localStorage.getItem('tauxFC')) || 2700);

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

  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      {/* ✅ ENTÊTE FIXE */}
      <div className="row sticky-top bg-white px-3 py-2 border-bottom" style={{ zIndex: 1030 }}>
        <div className="col-md-4">
          <h2 className="mb-0">🧾 Vente</h2>
        </div>
        <div className="col-md-8">
          <div className="row g-2 align-items-center">
            <div className="col-auto">
              <select
                className="form-select"
                value={devise}
                onChange={(e) => {
                  const value = e.target.value;
                  setDevise(value);
                  localStorage.setItem('devise', value);
                }}
              >
                <option value="USD">Dollars ($)</option>
                <option value="FC">Francs congolais (FC)</option>
              </select>
            </div>

            {devise === 'FC' && (
              <div className="col-auto">
                <input
                  type="number"
                  className="form-control"
                  style={{ minWidth: 120 }}
                  value={tauxFC}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setTauxFC(value);
                    localStorage.setItem('tauxFC', value);
                  }}
                  placeholder="Taux USD → FC"
                  min={1}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ FORMULAIRE DE VENTE */}
      <div className="sticky-top bg-light px-3 pt-2 pb-3 border-bottom" style={{ top: '56px', zIndex: 1020 }}>
        <SaleForm produits={produits} onAdd={ajouterAuPanier} />
      </div>

      {/* ✅ TABLEAU FACTURE */}
      <div className="flex-grow-1 overflow-auto px-3 py-3" style={{ maxHeight: 'calc(100vh - 170px)' }}>
        <div className="table-responsive">
          <Invoice
            panier={panier}
            total={total}
            onRemove={supprimerDuPanier}
            devise={devise}
            tauxFC={tauxFC}
            produits={produits}
            setProduits={setProduits}
            viderPanier={() => setPanier([])}
          />
        </div>
      </div>
    </div>
  );
}
