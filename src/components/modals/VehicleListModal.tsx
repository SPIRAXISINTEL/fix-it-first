import React from 'react';
import { useApp } from '@/contexts/AppContext';

interface Props { onClose: () => void; }

const VehicleListModal: React.FC<Props> = ({ onClose }) => {
  const { vehicles, contractData, updateContract } = useApp();

  const selectVehicle = (v: typeof vehicles[0]) => {
    updateContract('vehicle.model', `${v.brand} ${v.model}`);
    updateContract('vehicle.plate', v.plate);
    updateContract('vehicle.color', v.color);
    updateContract('vehicle.firstCirculationDate', v.year.toString());
    updateContract('registrationNumber', v.plate);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content large">
        <div className="modal-header">
          <h2>📋 LISTE DES VÉHICULES ({vehicles.length})</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        <div className="modal-body">
          <div className="item-list" style={{ maxHeight: '390px' }}>
            {vehicles.map(v => (
              <div key={v.id} className="item" onClick={() => selectVehicle(v)} style={{ justifyContent: 'space-between' }}>
                <div>
                  <strong>{v.brand} {v.model}</strong>
                  <span style={{ marginLeft: '10px', color: 'var(--chrome)', fontSize: '12px', fontFamily: 'var(--font-m)' }}>{v.plate}</span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-s)' }}>{v.color}, {v.year}</span>
              </div>
            ))}
          </div>
          {vehicles.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--chrome)', padding: '20px', fontFamily: 'var(--font-m)', fontSize: '11px' }}>Aucun véhicule enregistré</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleListModal;
