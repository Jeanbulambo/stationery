import React, { useState } from 'react';

export default function Login({ setUser }) {
  const [nom, setNom] = useState('');
  const [role, setRole] = useState('utilisateur');

  const handleLogin = () => {
    if (nom.trim()) {
      localStorage.setItem('user', nom);
      localStorage.setItem('role', role);
      setUser(nom); // Déclenche le re-render dans App.jsx
    }
  };

  return (
    <div className="container mt-5">
      <h2>Connexion</h2>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Entrez votre nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
      />
      <select
        className="form-select mb-3"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="utilisateur">Utilisateur</option>
        <option value="admin">Administrateur</option>
      </select>
      <button className="btn btn-primary" onClick={handleLogin}>
        Se connecter
      </button>
    </div>
  );
}
