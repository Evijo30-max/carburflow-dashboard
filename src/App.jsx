import React, { useState } from 'react';
import { sitesData, historicalData } from './data';
import { 
  Fuel, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Clock, 
  ShieldAlert,
  Search,
  Filter
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEtat, setFilterEtat] = useState('TOUS');

  // Filtrage des sites
  const filteredSites = sitesData.filter(site => {
    const matchesSearch = site.site.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          site.marque.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEtat = filterEtat === 'TOUS' || site.etat === filterEtat;
    return matchesSearch && matchesEtat;
  });

  // Calculs KPI globaux
  const totalGasoil = sitesData.reduce((acc, curr) => acc + curr.quantiteCuveP, 0);
  const totalSites = sitesData.length;
  const sitesFonctionnels = sitesData.filter(s => s.etat === 'F').length;
  const sitesEnPanne = sitesData.filter(s => s.etat === 'P' || s.etat === 'HS').length;
  const alertesJauges = sitesData.filter(s => s.observation.toLowerCase().includes('jauge') || s.observation.toLowerCase().includes('illisible')).length;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '24px' }}>
      
      {/* En-tête */}
      <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: '#1e293b', margin: 0, fontWeight: 'bold' }}>
            ⛽ CARBURFLOW - Energy & Fleet Dashboard
          </h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>
            Direction Technique - DRL BUF Centre | Suivi des Consommations & Cuves GES
          </p>
        </div>
        <div style={{ backgroundColor: '#e2e8f0', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', color: '#334155' }}>
          Semaine du 13 au 17 Juillet 2026
        </div>
      </header>

      {/* Cartes KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b', fontSize: '14px' }}>Stock Total Gasoil</span>
            <Fuel color="#3b82f6" size={24} />
          </div>
          <h2 style={{ fontSize: '24px', margin: '12px 0 0 0', color: '#0f172a' }}>{totalGasoil.toLocaleString()} L</h2>
          <span style={{ fontSize: '12px', color: '#10b981' }}>▲ Inclut livraisons Neptune Oil</span>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b', fontSize: '14px' }}>GES Fonctionnels</span>
            <CheckCircle2 color="#10b981" size={24} />
          </div>
          <h2 style={{ fontSize: '24px', margin: '12px 0 0 0', color: '#0f172a' }}>{sitesFonctionnels} / {totalSites}</h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>{((sitesFonctionnels/totalSites)*100).toFixed(0)}% du parc opérationnel</span>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b', fontSize: '14px' }}>En Panne / HS</span>
            <XCircle color="#ef4444" size={24} />
          </div>
          {/* Modification ici : Affichage X / Total */}
          <h2 style={{ fontSize: '24px', margin: '12px 0 0 0', color: '#ef4444' }}>
            {sitesEnPanne} / {totalSites}
          </h2>
          <span style={{ fontSize: '12px', color: '#ef4444' }}>
            {((sitesEnPanne / totalSites) * 100).toFixed(0)}% du parc hors service
          </span>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b', fontSize: '14px' }}>Anomalies & Jauges</span>
            <ShieldAlert color="#f59e0b" size={24} />
          </div>
          <h2 style={{ fontSize: '24px', margin: '12px 0 0 0', color: '#f59e0b' }}>{alertesJauges} Alertes</h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Lectures floues / Dégradées</span>
        </div>

      </div>

      {/* Graphiques */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        
        {/* Graphique 1 : Évolution des Stocks */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#334155' }}>📈 Évolution Multi-Semaines du Stock Total (Litres)</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semaine" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="stockTotal" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique 2 : Volume par Site */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#334155' }}>📊 Stock Gasoil Disponible par Site (Litres)</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sitesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="site" tick={{fontSize: 10}} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantiteCuveP" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Tableau détaillé */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>📋 État Détaillé des Sites et Autonomies</h3>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              placeholder="Rechercher un site, marque..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
            />
            <select 
              value={filterEtat} 
              onChange={(e) => setFilterEtat(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
            >
              <option value="TOUS">Tous les états</option>
              <option value="F">Fonctionnel (F)</option>
              <option value="P">En Panne (P)</option>
              <option value="HS">Hors Service (HS)</option>
            </select>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textTransform: 'none', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '12px' }}>Site</th>
              <th style={{ padding: '12px' }}>Groupe / Puissance</th>
              <th style={{ padding: '12px' }}>État</th>
              <th style={{ padding: '12px' }}>Stock Cuve Principal</th>
              <th style={{ padding: '12px' }}>Compteur Horaire</th>
              <th style={{ padding: '12px' }}>Observations & Anomalies</th>
            </tr>
          </thead>
          <tbody>
            {filteredSites.map((site) => (
              <tr key={site.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px', fontWeight: 'bold', color: '#1e293b' }}>{site.site}</td>
                <td style={{ padding: '12px', color: '#64748b' }}>{site.marque} ({site.puissance} kVA)</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    backgroundColor: site.etat === 'F' ? '#dcfce7' : site.etat === 'P' ? '#fef3c7' : '#fee2e2',
                    color: site.etat === 'F' ? '#166534' : site.etat === 'P' ? '#92400e' : '#991b1b'
                  }}>
                    {site.etat === 'F' ? 'Fonctionnel' : site.etat === 'P' ? 'En Panne' : 'Hors Service'}
                  </span>
                </td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{site.quantiteCuveP.toLocaleString()} Litres</td>
                <td style={{ padding: '12px', color: '#64748b' }}>{site.compteurHoraire ? `${site.compteurHoraire} h` : 'Illisible / XXXX'}</td>
                <td style={{ padding: '12px', color: '#334155', maxWidth: '300px' }}>
                  {site.observation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}