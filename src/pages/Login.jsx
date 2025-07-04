import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import { getAllUtilisateurs } from '../services/indexedDB';
import { initialiserAdminParDéfaut } from '../init/seedAdmin';
import backgroundImage from '../assets/logoktw.jpeg'; // ✅ Image locale

export default function Login({ setUser }) {
  const [nom, setNom] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initialiserAdminParDéfaut().catch((e) =>
      console.error("Erreur lors de l'initialisation admin par défaut", e)
    );
  }, []);

  const handleLogin = async () => {
    if (!nom.trim() || !motDePasse.trim()) {
      setErreur("Veuillez remplir tous les champs");
      return;
    }

    setErreur('');
    setLoading(true);

    try {
      const utilisateurs = await getAllUtilisateurs();
      const utilisateur = utilisateurs.find(
        u => u.username.trim().toLowerCase() === nom.trim().toLowerCase()
      );

      if (!utilisateur) {
        setErreur("Nom d'utilisateur incorrect");
        setLoading(false);
        return;
      }

      const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.passwordHash);
      if (!motDePasseValide) {
        setErreur("Mot de passe incorrect");
        setLoading(false);
        return;
      }

      const utilisateurConnecte = {
        id: utilisateur.id,
        username: utilisateur.username,
        role: utilisateur.role
      };

      localStorage.setItem('user', JSON.stringify(utilisateurConnecte));
      setUser(utilisateurConnecte);
    } catch (err) {
      console.error("Erreur lors de la tentative de connexion :", err);
      setErreur("Une erreur est survenue, veuillez réessayer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Overlay sombre */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 0,
        }}
      />

      {/* Carte de connexion */}
      <div
        className="card shadow p-4"
        style={{
          maxWidth: 400,
          width: '100%',
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '10px',
        }}
      >
        <h4 className="mb-4 text-center">🔐 Connexion</h4>

        {erreur && <div className="alert alert-danger">{erreur}</div>}

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Nom d'utilisateur"
          value={nom}
          onChange={(e) => {
            setNom(e.target.value);
            setErreur('');
          }}
          autoComplete="username"
          disabled={loading}
          autoFocus
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Mot de passe"
          value={motDePasse}
          onChange={(e) => {
            setMotDePasse(e.target.value);
            setErreur('');
          }}
          autoComplete="current-password"
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !loading) handleLogin();
          }}
        />

        <button
          className="btn btn-primary w-100"
          onClick={handleLogin}
          disabled={loading || !nom.trim() || !motDePasse.trim()}
        >
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </div>
    </div>
  );
}
