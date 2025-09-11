import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import Vente from './pages/Vente.jsx';
import Produits from './pages/Produits.jsx';
import Statistiques from './pages/Statistiques.jsx';
import Utilisateurs from './pages/Utilisateurs.jsx';
import Login from './pages/Login.jsx';
import HistoriqueFactures from './pages/HistoriqueFactures.jsx';
import HistoriqueApprovisionnements from './pages/HistoriqueApprovisionnements.jsx';
import AccessDenied from './pages/AccessDenied.jsx';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  const parseUser = () => {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState(parseUser);

  useEffect(() => {
    const storedUser = parseUser();
    if (JSON.stringify(storedUser) !== JSON.stringify(user)) {
      setUser(storedUser);
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // 👉 Route réservée uniquement à l'admin
  const AdminRoute = ({ element }) => {
    return user?.role === 'admin' ? element : <AccessDenied />;
  };

  return (
    <Router>
      {user && <Navbar user={user} setUser={handleLogout} />}
      <div className="container mt-4">
        <Routes>
          {!user && (
            <>
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}

          {user && (
            <>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/vente" element={<Vente />} />
              <Route path="/statistiques" element={<Statistiques />} />
              <Route path="/produits" element={<Produits />} />
              <Route path="/approvisionnements" element={<HistoriqueApprovisionnements />} />
              <Route path="/factures" element={<HistoriqueFactures />} />

              {/* 🚨 Seule page réservée aux admins */}
              <Route path="/utilisateurs" element={<AdminRoute element={<Utilisateurs />} />} />

              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </div>

      <footer className="text-center text-muted py-3 mt-5 border-top">
        <small>© {new Date().getFullYear()} Walikale to World – Tous droits réservés</small><br />
        <small>contact +243 972 179 136 – Jeanbulambo4@gmail.com – linkedin.com/in/jean-bulambo</small>
      </footer>
    </Router>
  );
}

export default App;
