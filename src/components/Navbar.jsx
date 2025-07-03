import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logoktw.jpeg';

export default function Navbar({ user, setUser }) {
  const location = useLocation();
  const [menuOuvert, setMenuOuvert] = useState(false);

  const handleLogout = () => {
    setUser(null);
  };

  const toggleMenu = () => {
    setMenuOuvert(!menuOuvert);
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
      <div className="container">
        {/* Logo + titre */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="Logo"
            height="40"
            className="me-2 rounded"
            style={{ objectFit: 'contain' }}
          />
          <strong>Walikale to World</strong>
        </Link>

        {/* Bouton hamburger */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={menuOuvert}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className={`collapse navbar-collapse ${menuOuvert ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

            {/* Pages communes (Accueil, Vente, Statistiques) */}
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/" onClick={toggleMenu}>Accueil</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/vente')}`} to="/vente" onClick={toggleMenu}>Vente</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/statistiques')}`} to="/statistiques" onClick={toggleMenu}>Statistiques</Link>
            </li>

            {/* Pages réservées à l'admin */}
            {user?.role === 'admin' && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/produits')}`} to="/produits" onClick={toggleMenu}>Produits</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/approvisionnements')}`} to="/approvisionnements" onClick={toggleMenu}>Approvisionnements</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/factures')}`} to="/factures" onClick={toggleMenu}>Factures</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/utilisateurs')}`} to="/utilisateurs" onClick={toggleMenu}>Utilisateurs</Link>
                </li>
              </>
            )}

            {/* Profil + Déconnexion */}
            <li className="nav-item d-flex align-items-center ms-lg-3 mt-2 mt-lg-0">
              <span className="me-2 text-muted">👤 {user?.username || 'Invité'}</span>
              <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Déconnexion</button>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}
