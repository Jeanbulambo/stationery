import React from 'react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

export default function StatsChart({ data }) {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <h4>Graphique des ventes</h4>
      <ResponsiveContainer>
        <LineChart data={data}>
          <Line type="monotone" dataKey="total" stroke="#007bff" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
