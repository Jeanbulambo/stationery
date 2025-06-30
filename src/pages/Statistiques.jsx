import React, { useEffect, useState } from 'react';
import StatsChart from '../components/StatsChart';
import { initDB } from '../services/indexedDB';

export default function Statistiques() {
  const [stats, setStats] = useState([]);
  const [totalVentes, setTotalVentes] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      const db = await initDB();
      const factures = await db.getAll('factures');

      // Regrouper par date (format YYYY-MM-DD)
      const grouped = {};
      let total = 0;

      factures.forEach(f => {
        const date = new Date(f.date || f.timestamp || Date.now()).toISOString().slice(0, 10);
        if (!grouped[date]) grouped[date] = 0;
        grouped[date] += f.total || 0;
        total += f.total || 0;
      });

      const formatted = Object.entries(grouped).map(([date, total]) => ({ date, total }));
      setStats(formatted);
      setTotalVentes(total);
    }

    fetchStats();
  }, []);

  return (
    <div className="container">
      <h2>Statistiques de vente</h2>
      <p><strong>Total général des ventes :</strong> {totalVentes} $</p>
      <StatsChart data={stats} />
    </div>
  );
}
