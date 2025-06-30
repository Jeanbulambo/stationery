import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ setUser }) {
  const user = localStorage.getItem('user');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setUser(null); // 🚨 Déclenche le retour vers <Login />
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <Link className="navbar-brand" to="/">Papeterie</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item"><Link className="nav-link" to="/">Vente</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/produits">Produits</Link></li>
          {role === 'admin' && (
          <li className="nav-item"><Link className="nav-link" to="/statistiques">Statistiques</Link></li>
          )}
          {role === 'admin' && (
            <li className="nav-item"><Link className="nav-link" to="/utilisateurs">Utilisateurs</Link></li>
          )}
        </ul>
        <div className="d-flex align-items-center">
          <span className="me-3">👤 {user} ({role})</span>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}
