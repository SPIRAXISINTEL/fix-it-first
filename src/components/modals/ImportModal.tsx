import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';

interface Props { onClose: () => void; }

const ImportModal: React.FC<Props> = ({ onClose }) => {
  const { setVehicles } = useApp();
  const [status, setStatus] = useState<{ type: string; message: string } | null>(null);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setStatus({ type: 'loading', message: 'Importation en cours...' });
    const r = new FileReader();
    r.onload = (ev) => {
      try {
        const lines = (ev.target?.result as string).split('\n').filter(l => l.trim());
        let count = 0;
        for (let i = 1; i < lines.length; i++) {
          const vals = lines[i].split(',').map(v => v.trim());
          if (vals[0]) {
            setVehicles(prev => [...prev, { id: Date.now() + i, plate: vals[0], brand: vals[1] || '', model: vals[2] || '', year: parseInt(vals[3]) || 2020, color: vals[4] || '' }]);
            count++;
          }
        }
        setStatus({ type: 'success', message: `${count} véhicule(s) importé(s) avec succès !` });
        setTimeout(() => onClose(), 2000);
      } catch { setStatus({ type: 'error', message: 'Erreur de lecture du fichier.' }); }
    };
    r.readAsText(f);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>📁 IMPORTER DES VÉHICULES</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Fichier CSV</label>
            <input type="file" onChange={handleFileImport} accept=".csv" style={{ color: 'var(--text-p)' }} />
            <small className="form-note" style={{ display: 'block', marginTop: '6px' }}>Format : Immatriculation, Marque, Modèle, Année, Couleur</small>
            <small className="form-note">Exemple : 12345-أ-1,TOYOTA,YARIS HB,2020,BLANC</small>
          </div>
          {status && (
            <div className={`login-message ${status.type === 'error' ? 'error' : ''}`}
              style={status.type === 'success' ? { background: 'var(--green-dim)', borderColor: 'rgba(34,197,94,.28)', color: 'var(--green)' } : undefined}>
              {status.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
