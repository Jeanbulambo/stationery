import React from 'react';
import { Link } from 'react-router-dom';

export default function AccessDenied() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      <h1 className="display-4 text-danger mb-3">⛔ Accès refusé</h1>
      <p className="lead mb-4">
        Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
      </p>
      <Link to="/" className="btn btn-primary">
        Retour à l'accueil
      </Link>
    </div>
  );
}
