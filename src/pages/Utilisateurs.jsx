import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Utilisateurs() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert("Accès refusé : réservé à l'administrateur.");
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="container">
      <h2>Gestion des utilisateurs</h2>
      {/* Contenu ici */}
    </div>
  );
}
