import { openDB } from 'idb';

export async function initDB() {
  return await openDB('papeterieDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('produits'))
        db.createObjectStore('produits', { keyPath: 'id', autoIncrement: true });

      if (!db.objectStoreNames.contains('factures'))
        db.createObjectStore('factures', { keyPath: 'id', autoIncrement: true });

      if (!db.objectStoreNames.contains('utilisateurs'))
        db.createObjectStore('utilisateurs', { keyPath: 'id', autoIncrement: true });
    },
  });
}

// Fonctions spécifiques
export async function addProduit(produit) {
  const db = await initDB();
  return await db.add('produits', produit);
}

export async function getAllProduits() {
  const db = await initDB();
  return await db.getAll('produits');
}

// Fonctions génériques
export async function addItem(store, item) {
  const db = await initDB();
  return await db.add(store, item);
}

export async function getAllItems(store) {
  const db = await initDB();
  return await db.getAll(store);
}

export async function updateItem(storeName, item) {
  const db = await initDB();
  return db.put(storeName, item);
}

export async function addFacture(facture) {
  const db = await initDB();
  const date = new Date().toISOString().slice(0, 10); // format YYYY-MM-DD
  await db.add('factures', { ...facture, date });
}


