import { openDB } from 'idb';
import bcrypt from 'bcryptjs';

export async function initDB() {
  const db = await openDB('papeterieDB', 2, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('produits')) {
        db.createObjectStore('produits', { keyPath: 'id', autoIncrement: true });
      }

      if (!db.objectStoreNames.contains('factures')) {
        db.createObjectStore('factures', { keyPath: 'id', autoIncrement: true });
      }

      if (!db.objectStoreNames.contains('utilisateurs')) {
        const store = db.createObjectStore('utilisateurs', { keyPath: 'id', autoIncrement: true });
        store.createIndex('username', 'username', { unique: true });
      }

      if (!db.objectStoreNames.contains('approvisionnements')) {
        const store = db.createObjectStore('approvisionnements', { keyPath: 'id', autoIncrement: true });
        store.createIndex('produitId', 'produitId', { unique: false });
      }
    },
  });

  // ✅ Vérifier utilisateurs EN DEHORS d'une transaction manuelle
  const usersExistants = await db.getAll('utilisateurs');
  if (usersExistants.length === 0) {
    const passwordHashAdmin = await bcrypt.hash('admin123', 10);
    const passwordHashUser = await bcrypt.hash('user123', 10);

    // ✅ Créer une transaction active maintenant
    const tx = db.transaction('utilisateurs', 'readwrite');
    const store = tx.objectStore('utilisateurs');

    await store.add({
      username: 'admin',
      role: 'admin',
      passwordHash: passwordHashAdmin,
    });

    await store.add({
      username: 'utilisateur',
      role: 'utilisateur',
      passwordHash: passwordHashUser,
    });

    await tx.done;
    console.log('✅ Utilisateurs initiaux créés : admin / admin123 et utilisateur / user123');
  }

  return db;
}

export async function addItem(storeName, item) {
  const db = await initDB();
  return await db.add(storeName, item);
}

export async function getAllItems(storeName) {
  const db = await initDB();
  return await db.getAll(storeName);
}

export async function updateItem(storeName, item) {
  const db = await initDB();
  return await db.put(storeName, item);
}

export async function deleteItem(storeName, id) {
  const db = await initDB();
  return await db.delete(storeName, id);
}

export async function addProduit(produit) {
  return await addItem('produits', produit);
}

export async function getAllProduits() {
  return await getAllItems('produits');
}

export async function addFacture(facture) {
  const db = await initDB();
  const date = new Date().toISOString().slice(0, 10);
  return await db.add('factures', { ...facture, date });
}

export async function addApprovisionnement(record) {
  return await addItem('approvisionnements', record);
}

export async function getApprovisionnements() {
  return await getAllItems('approvisionnements');
}

export async function addUtilisateur(user) {
  return await addItem('utilisateurs', user);
}

export async function getAllUtilisateurs() {
  return await getAllItems('utilisateurs');
}

export async function getUtilisateurByUsername(username) {
  const db = await initDB();
  const tx = db.transaction('utilisateurs', 'readonly');
  const store = tx.objectStore('utilisateurs');
  const index = store.index('username');

  return new Promise((resolve, reject) => {
    const request = index.get(username);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
