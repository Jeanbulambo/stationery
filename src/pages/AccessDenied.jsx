import React from 'react';

export default function AccessDenied() {
  return (
    <div className="text-center mt-5">
      <h1 className="text-danger">⛔ Accès refusé</h1>
      <p className="lead">Vous n’avez pas les droits nécessaires pour accéder à cette page.</p>
    </div>
  );
}
