import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logoktw.jpeg'; // 👈 Import du logo

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const lienActif = ({ isActive }) =>
    isActive ? 'nav-link active fw-bold' : 'nav-link';

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark px-3 position-fixed top-0 start-0 w-100 shadow"
      style={{ zIndex: 1030 }}
    >
      {/* Logo avec marge à droite */}
      <NavLink className="navbar-brand d-flex align-items-center me-4" to="/">
        <img
          src={logo}
          alt="Logo"
          height="35"
          className="me-2 rounded"
          style={{ objectFit: 'cover' }}
        />
        Papeterie
      </NavLink>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <NavLink to="/" className={lienActif}>
              Accueil
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/vente" className={lienActif}>
              Vente
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/statistiques" className={lienActif}>
              Statistiques
            </NavLink>
          </li>

          {user?.role === 'admin' && (
            <>
              <li className="nav-item">
                <NavLink to="/produits" className={lienActif}>
                  Produits
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/approvisionnements" className={lienActif}>
                  Approvisionnements
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/factures" className={lienActif}>
                  Factures
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/utilisateurs" className={lienActif}>
                  Utilisateurs
                </NavLink>
              </li>
            </>
          )}
        </ul>

        <ul className="navbar-nav ms-auto">
          <li className="nav-item me-3">
            <span className="nav-link text-white">
              👤 {user?.username} ({user?.role})
            </span>
          </li>
          <li className="nav-item">
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Se déconnecter
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
