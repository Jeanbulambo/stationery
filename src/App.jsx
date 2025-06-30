import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Vente from './pages/Vente.jsx';
import Produits from './pages/Produits.jsx';
import Statistiques from './pages/Statistiques.jsx';
import Utilisateurs from './pages/Utilisateurs.jsx';
import Login from './pages/Login.jsx';

function App() {
  const [user, setUser] = useState(localStorage.getItem('user'));

  return (
    <Router>
      {!user ? (
        <Login setUser={setUser} />
      ) : (
        <>
          <Navbar setUser={setUser} />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<Vente />} />
              <Route path="/produits" element={<Produits />} />
              <Route path="/statistiques" element={<Statistiques />} />
              <Route path="/utilisateurs" element={<Utilisateurs />} />
            </Routes>
          </div>
        </>
      )}
    </Router>
  );
}

export default App;
