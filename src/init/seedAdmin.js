// src/init/seedAdmin.js

import bcrypt from 'bcryptjs';
import { getAllUtilisateurs, addUtilisateur } from '../services/indexedDB';

export async function initialiserAdminParDéfaut() {
  const utilisateurs = await getAllUtilisateurs();
  if (utilisateurs.length === 0) {
    const hash = await bcrypt.hash('admin123', 10);
    await addUtilisateur({
      username: 'admin',
      role: 'admin',
      passwordHash: hash,
    });
    console.log('[seed] Admin par défaut créé : admin / admin123');
  }
}
