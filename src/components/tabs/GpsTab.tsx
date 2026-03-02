import React, { useState, useMemo } from 'react';
import { useApp, type GpsVehicle } from '@/contexts/AppContext';

const getStatusLabel = (s: string) => {
  const map: Record<string, string> = { disponible: 'Disponible', loue: 'En location', maintenance: 'Maintenance', inactif: 'Inactif' };
  return map[s] || s;
};
const getStatusColor = (s: string) => {
  const map: Record<string, string> = { disponible: 'var(--green)', loue: 'var(--accent)', maintenance: 'var(--amber)', inactif: 'var(--chrome)' };
  return map[s] || 'var(--chrome)';
};
const getFuelColor = (pct: number) => pct > 50 ? 'var(--green)' : pct > 25 ? 'var(--amber)' : 'var(--accent-hot)';
const getMarkerBg = (s: string) => {
  const map: Record<string, string> = { disponible: 'rgba(34,197,94,0.2)', loue: 'rgba(220,38,38,0.2)', maintenance: 'rgba(245,158,11,0.2)', inactif: 'rgba(136,136,160,0.15)' };
  return map[s] || 'rgba(136,136,160,0.15)';
};
const getMarkerBorder = (s: string) => {
  const map: Record<string, string> = { disponible: '#22C55E', loue: '#DC2626', maintenance: '#F59E0B', inactif: '#8888A0' };
  return map[s] || '#8888A0';
};
const formatGpsTime = (iso: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `Il y a ${diff}s`;
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)}min`;
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

const GpsTab: React.FC = () => {
  const { gpsVehicles, selectedGpsVehicle, setSelectedGpsVehicle } = useApp();
  const [gpsFilter, setGpsFilter] = useState('tous');
  const [gpsSearchQuery, setGpsSearchQuery] = useState('');

  const filteredGpsVehicles = useMemo(() => {
    let list = gpsVehicles;
    if (gpsFilter !== 'tous') list = list.filter(v => v.status === gpsFilter);
    if (gpsSearchQuery) {
      const s = gpsSearchQuery.toLowerCase();
      list = list.filter(v =>
        (v.brand + ' ' + v.model).toLowerCase().includes(s) ||
        v.plate.includes(s) || (v.driver || '').toLowerCase().includes(s)
      );
    }
    return list;
  }, [gpsVehicles, gpsFilter, gpsSearchQuery]);

  const gpsStats = useMemo(() => ({
    total: gpsVehicles.length,
    disponibles: gpsVehicles.filter(v => v.status === 'disponible').length,
    loues: gpsVehicles.filter(v => v.status === 'loue').length,
    maintenance: gpsVehicles.filter(v => v.status === 'maintenance').length,
    alertes: gpsVehicles.reduce((acc, v) => acc + v.alertes.length, 0)
  }), [gpsVehicles]);

  const selectGpsVehicle = (v: GpsVehicle) => {
    setSelectedGpsVehicle(prev => prev?.id === v.id ? null : v);
  };

  // Keep selected vehicle in sync with gpsVehicles updates
  const currentSelected = selectedGpsVehicle ? gpsVehicles.find(v => v.id === selectedGpsVehicle.id) || selectedGpsVehicle : null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div className="section-title" style={{ marginBottom: 0, border: 'none', paddingBottom: 0 }}>Suivi GPS en Temps Réel</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="api-banner">⚡ Simulation active</span>
          <div style={{ display: 'flex', gap: '12px', fontFamily: 'var(--font-m)', fontSize: '10px', color: 'var(--chrome)', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-dim)', borderRadius: 'var(--r-sm)', padding: '6px 12px' }}>
            <span>🟢 {gpsStats.disponibles} Disponibles</span>
            <span>🔴 {gpsStats.loues} En location</span>
            <span>🟡 {gpsStats.maintenance} Maintenance</span>
            {gpsStats.alertes > 0 && <span style={{ color: 'var(--accent-hot)' }}>⚠️ {gpsStats.alertes} Alertes</span>}
          </div>
        </div>
      </div>

      <div className="gps-layout">
        {/* Sidebar */}
        <div className="gps-sidebar">
          <div className="gps-sidebar-header">
            <div className="gps-sidebar-title">Flotte ({gpsVehicles.length})</div>
            <input type="text" value={gpsSearchQuery} onChange={e => setGpsSearchQuery(e.target.value)} placeholder="Rechercher..." className="search-input" style={{ marginBottom: '10px' }} />
            <div className="gps-filter-row">
              {['tous', 'disponible', 'loue', 'maintenance'].map(f => (
                <button key={f} className={`gps-filter-btn ${gpsFilter === f ? 'active' : ''}`} onClick={() => setGpsFilter(f)}>
                  {f === 'tous' ? 'Tous' : f === 'disponible' ? 'Disponibles' : f === 'loue' ? 'En location' : 'Maintenance'}
                </button>
              ))}
            </div>
          </div>
          <div className="gps-vehicle-list">
            {filteredGpsVehicles.map(v => (
              <div key={v.id} className={`gps-vehicle-item ${currentSelected?.id === v.id ? 'selected' : ''}`} onClick={() => selectGpsVehicle(v)}>
                <div className="gps-veh-avatar" style={{ background: getMarkerBg(v.status), border: `1px solid ${getMarkerBorder(v.status)}` }}>{v.emoji}</div>
                <div className="gps-veh-info">
                  <div className="gps-veh-name">{v.brand} {v.model}</div>
                  <div className="gps-veh-plate">{v.plate}</div>
                  {v.status === 'loue' ? (
                    <div className="gps-veh-speed">{Math.round(v.gps.speed)} km/h {v.alertes.length > 0 && <span style={{ color: 'var(--accent-hot)', marginLeft: '4px' }}>⚠️</span>}</div>
                  ) : (
                    <div className="gps-veh-speed" style={{ color: getStatusColor(v.status) }}>{getStatusLabel(v.status)}</div>
                  )}
                </div>
                <div className={`gps-dot ${v.status}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Map Area */}
        <div className="gps-map-area">
          <div className="gps-map-canvas">
            <div className="gps-map-grid" />
            {/* SVG roads */}
            <svg className="gps-map-roads" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 10 50 Q 30 30 50 50 Q 70 70 90 50" stroke="rgba(220,38,38,0.12)" strokeWidth="0.6" fill="none" strokeDasharray="2 2" />
              <path d="M 50 10 Q 40 40 50 50 Q 60 60 50 90" stroke="rgba(220,38,38,0.1)" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
              <path d="M 15 20 L 85 80" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
              <path d="M 85 20 L 15 80" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
            </svg>

            {/* Vehicle markers */}
            {gpsVehicles.map(v => (
              <div key={v.id} className="map-vehicle-marker" style={{ left: `${v.mapX}%`, top: `${v.mapY}%` }} onClick={() => selectGpsVehicle(v)}>
                {v.routePoints && currentSelected?.id === v.id && (
                  <svg style={{ position: 'absolute', top: '-100%', left: '-100%', width: '300%', height: '300%', pointerEvents: 'none' }} viewBox="0 0 100 100">
                    <path d={v.routePoints} className="route-draw" stroke={getMarkerBorder(v.status)} strokeWidth="0.5" fill="none" opacity="0.5" />
                    <path d={v.routePoints} className="route-pulse" stroke={getMarkerBorder(v.status)} strokeWidth="0.3" fill="none" opacity="0.3" />
                  </svg>
                )}
                <div className="map-marker-core" style={{ background: getMarkerBg(v.status), borderColor: getMarkerBorder(v.status) }}>
                  {v.emoji}
                  <div className="map-marker-pulse" style={{ border: `1px solid ${getMarkerBorder(v.status)}` }} />
                </div>
                <div className="map-vehicle-label">{v.plate}</div>
              </div>
            ))}

            {!currentSelected && (
              <div className="gps-no-selection">
                <div className="gps-no-selection-icon">📡</div>
                <div className="gps-no-selection-text">Sélectionnez un véhicule</div>
              </div>
            )}

            {/* Overlay with detail panel */}
            {currentSelected && (
              <div className="gps-map-overlay">
                <div className="gps-map-topbar">
                  <div className="gps-detail-panel">
                    <div className="gps-detail-title">
                      {currentSelected.brand} {currentSelected.model}
                      {currentSelected.status === 'loue' && (
                        <span className="gps-live-badge"><span className="gps-live-dot" /> LIVE</span>
                      )}
                    </div>
                    <div className="gps-detail-row"><span className="gps-detail-key">Plaque</span><span className="gps-detail-val">{currentSelected.plate}</span></div>
                    <div className="gps-detail-row"><span className="gps-detail-key">Statut</span><span className="gps-detail-val" style={{ color: getStatusColor(currentSelected.status) }}>{getStatusLabel(currentSelected.status)}</span></div>
                    {currentSelected.driver && <div className="gps-detail-row"><span className="gps-detail-key">Conducteur</span><span className="gps-detail-val">{currentSelected.driver}</span></div>}
                    {currentSelected.destination && <div className="gps-detail-row"><span className="gps-detail-key">Destination</span><span className="gps-detail-val">{currentSelected.destination}</span></div>}
                    {currentSelected.distanceRestante && <div className="gps-detail-row"><span className="gps-detail-key">Distance</span><span className="gps-detail-val">{currentSelected.distanceRestante}</span></div>}
                    {currentSelected.tempsEstime && <div className="gps-detail-row"><span className="gps-detail-key">ETA</span><span className="gps-detail-val">{currentSelected.tempsEstime}</span></div>}
                    <div className="gps-gauge-row">
                      <div className="gps-mini-gauge">
                        <div className="gps-mini-gauge-label">Carburant</div>
                        <div className="gps-mini-gauge-val" style={{ color: getFuelColor(currentSelected.fuel) }}>{Math.round(currentSelected.fuel)}%</div>
                        <div className="gps-mini-gauge-bar"><div className="gps-mini-gauge-fill" style={{ width: `${currentSelected.fuel}%`, background: getFuelColor(currentSelected.fuel) }} /></div>
                      </div>
                      <div className="gps-mini-gauge">
                        <div className="gps-mini-gauge-label">Batterie</div>
                        <div className="gps-mini-gauge-val" style={{ color: currentSelected.battery > 50 ? 'var(--green)' : 'var(--amber)' }}>{currentSelected.battery}%</div>
                        <div className="gps-mini-gauge-bar"><div className="gps-mini-gauge-fill" style={{ width: `${currentSelected.battery}%`, background: currentSelected.battery > 50 ? 'var(--green)' : 'var(--amber)' }} /></div>
                      </div>
                    </div>
                    {currentSelected.alertes.length > 0 && (
                      <div style={{ marginTop: '10px' }}>
                        {currentSelected.alertes.map((a, i) => (
                          <div key={i} style={{ fontSize: '10px', color: 'var(--accent-hot)', fontFamily: 'var(--font-m)', padding: '3px 0' }}>⚠️ {a.msg}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="gps-map-controls">
                    <button className="gps-ctrl-btn">+</button>
                    <button className="gps-ctrl-btn">−</button>
                    <button className="gps-ctrl-btn">◎</button>
                  </div>
                </div>
                <div className="gps-map-spacer" />
                <div className="gps-map-bottom">
                  <div className="gps-stats-bar">
                    <div className="gps-stat">🌍 <strong>{currentSelected.gps.lat.toFixed(4)}, {currentSelected.gps.lng.toFixed(4)}</strong></div>
                    {currentSelected.status === 'loue' && <div className="gps-stat">🚀 <strong>{Math.round(currentSelected.gps.speed)} km/h</strong></div>}
                    <div className="gps-stat">⏱ <strong>{formatGpsTime(currentSelected.lastUpdate)}</strong></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GpsTab;
