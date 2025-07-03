import React, { useEffect, useState } from 'react';
import bcrypt from 'bcryptjs';
import {
  getAllUtilisateurs,
  addUtilisateur,
  updateItem,
  deleteItem,
} from '../services/indexedDB';

const rolesDisponibles = ['utilisateur', 'admin'];

export default function Utilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [nouveauNom, setNouveauNom] = useState('');
  const [nouveauRole, setNouveauRole] = useState('utilisateur');
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [editionId, setEditionId] = useState(null);
  const [editionNom, setEditionNom] = useState('');
  const [editionRole, setEditionRole] = useState('utilisateur');
  const [editionMotDePasse, setEditionMotDePasse] = useState('');

  useEffect(() => {
    const initAdmin = async () => {
      const data = await getAllUtilisateurs();
      setUtilisateurs(data);
      if (data.length === 0) {
        const passwordHash = await bcrypt.hash('admin123', 10);
        const admin = {
          username: 'admin',
          role: 'admin',
          passwordHash,
        };
        await addUtilisateur(admin);
        setUtilisateurs([admin]);
        alert('Compte admin créé avec identifiant "admin" et mot de passe "admin123"');
      }
    };
    initAdmin();
  }, []);

  const chargerUtilisateurs = async () => {
    const data = await getAllUtilisateurs();
    setUtilisateurs(data);
  };

  const ajouterUtilisateur = async () => {
    if (!nouveauNom.trim() || !nouveauMotDePasse.trim()) {
      return alert('Le nom et le mot de passe sont requis');
    }

    if (utilisateurs.find(u => u.username === nouveauNom.trim())) {
      return alert('Ce nom d’utilisateur existe déjà');
    }

    const passwordHash = await bcrypt.hash(nouveauMotDePasse.trim(), 10);
    const nouveau = {
      username: nouveauNom.trim(),
      role: nouveauRole,
      passwordHash,
    };

    await addUtilisateur(nouveau);
    setNouveauNom('');
    setNouveauRole('utilisateur');
    setNouveauMotDePasse('');
    chargerUtilisateurs();
  };

  const supprimerUtilisateur = async (id) => {
    if (window.confirm('Confirmer la suppression ?')) {
      await deleteItem('utilisateurs', id);
      chargerUtilisateurs();
    }
  };

  const commencerEdition = (u) => {
    setEditionId(u.id);
    setEditionNom(u.username);
    setEditionRole(u.role);
    setEditionMotDePasse('');
  };

  const sauvegarderEdition = async () => {
    if (!editionNom.trim()) return alert('Le nom est requis');

    const utilisateur = utilisateurs.find(u => u.id === editionId);
    if (!utilisateur) return;

    let passwordHash = utilisateur.passwordHash;
    if (editionMotDePasse.trim()) {
      passwordHash = await bcrypt.hash(editionMotDePasse.trim(), 10);
    }

    await updateItem('utilisateurs', {
      ...utilisateur,
      username: editionNom.trim(),
      role: editionRole,
      passwordHash,
    });

    annulerEdition();
    chargerUtilisateurs();
  };

  const annulerEdition = () => {
    setEditionId(null);
    setEditionNom('');
    setEditionRole('utilisateur');
    setEditionMotDePasse('');
  };

  return (
    <div className="container my-4">
      <h2>Gestion des utilisateurs</h2>

      <div className="mb-4">
        <h5>Ajouter un utilisateur</h5>
        <div className="row g-2 align-items-center">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Nom d'utilisateur"
              value={nouveauNom}
              onChange={e => setNouveauNom(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="password"
              className="form-control"
              placeholder="Mot de passe"
              value={nouveauMotDePasse}
              onChange={e => setNouveauMotDePasse(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={nouveauRole}
              onChange={e => setNouveauRole(e.target.value)}
            >
              {rolesDisponibles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <button className="btn btn-primary w-100" onClick={ajouterUtilisateur}>
              Ajouter
            </button>
          </div>
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {utilisateurs.map(u => (
            <tr key={u.id}>
              <td>
                {editionId === u.id ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editionNom}
                    onChange={e => setEditionNom(e.target.value)}
                  />
                ) : (
                  u.username
                )}
              </td>
              <td>
                {editionId === u.id ? (
                  <select
                    className="form-select"
                    value={editionRole}
                    onChange={e => setEditionRole(e.target.value)}
                  >
                    {rolesDisponibles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                ) : (
                  u.role
                )}
              </td>
              <td>
                {editionId === u.id ? (
                  <>
                    <input
                      type="password"
                      className="form-control mb-2"
                      placeholder="Nouveau mot de passe (laisser vide pour garder)"
                      value={editionMotDePasse}
                      onChange={e => setEditionMotDePasse(e.target.value)}
                    />
                    <button className="btn btn-sm btn-success me-2" onClick={sauvegarderEdition}>💾</button>
                    <button className="btn btn-sm btn-secondary" onClick={annulerEdition}>✖️</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => commencerEdition(u)}>✏️</button>
                    <button className="btn btn-sm btn-danger" onClick={() => supprimerUtilisateur(u.id)}>🗑️</button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {utilisateurs.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center text-muted">Aucun utilisateur</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
