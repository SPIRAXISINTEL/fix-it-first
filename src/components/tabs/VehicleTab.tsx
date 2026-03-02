import React, { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';

interface Props { onShowList: () => void; }

const VehicleTab: React.FC<Props> = ({ onShowList }) => {
  const { contractData, updateContract, vehicles, setVehicles } = useApp();
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [mileageType, setMileageType] = useState('limited');

  const filteredVehicles = useMemo(() => {
    if (!vehicleSearch) return vehicles;
    const s = vehicleSearch.toLowerCase();
    return vehicles.filter(v => v.brand.toLowerCase().includes(s) || v.model.toLowerCase().includes(s) || v.plate.includes(s));
  }, [vehicleSearch, vehicles]);

  const selectVehicle = (v: typeof vehicles[0]) => {
    updateContract('vehicle.model', `${v.brand} ${v.model}`);
    updateContract('vehicle.plate', v.plate);
    updateContract('vehicle.color', v.color);
    updateContract('vehicle.firstCirculationDate', v.year.toString());
    updateContract('registrationNumber', v.plate);
    setVehicleSearch('');
  };

  const addNewVehicle = () => {
    if (!contractData.vehicle.model || !contractData.vehicle.plate) { alert('Modèle et immatriculation obligatoires'); return; }
    const parts = contractData.vehicle.model.split(' ');
    setVehicles(prev => [...prev, {
      id: Date.now(), brand: parts[0] || '', model: parts.slice(1).join(' ') || parts[0] || '',
      plate: contractData.vehicle.plate, color: contractData.vehicle.color,
      year: parseInt(contractData.vehicle.firstCirculationDate) || new Date().getFullYear()
    }]);
    alert('Véhicule ajouté avec succès !');
  };

  return (
    <div>
      <div className="section">
        <div className="section-title">Rechercher un Véhicule</div>
        <div className="search-container">
          <input type="text" value={vehicleSearch} onChange={e => setVehicleSearch(e.target.value)} placeholder="Marque, modèle ou immatriculation..." className="search-input" />
          <div className="vehicle-actions">
            <button className="btn btn-secondary" onClick={addNewVehicle}>➕ Ajouter</button>
            <button className="btn btn-outline" onClick={onShowList}>📋 Liste véhicules</button>
          </div>
        </div>
        {vehicleSearch && (
          <div className="item-list">
            {filteredVehicles.map(v => (
              <div key={v.id} className="item" onClick={() => selectVehicle(v)}>
                <strong>{v.brand} {v.model}</strong> — {v.plate}
                <span style={{ color: 'var(--chrome)', fontSize: '12px' }}> ({v.color}, {v.year})</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <div className="section-title">Détails du Véhicule</div>
        <div className="form-grid">
          <div className="form-group"><label>Marque et Modèle</label><input type="text" value={contractData.vehicle.model} onChange={e => updateContract('vehicle.model', e.target.value)} placeholder="Ex: TOYOTA YARIS HB" /></div>
          <div className="form-group"><label>Immatriculation *</label><input type="text" value={contractData.vehicle.plate} onChange={e => updateContract('vehicle.plate', e.target.value)} placeholder="Ex: 12345-أ-1" /></div>
          <div className="form-group"><label>Couleur</label><input type="text" value={contractData.vehicle.color} onChange={e => updateContract('vehicle.color', e.target.value)} placeholder="Ex: BLANC" /></div>
          <div className="form-group"><label>1ère Mise en Circulation</label><input type="text" value={contractData.vehicle.firstCirculationDate} onChange={e => updateContract('vehicle.firstCirculationDate', e.target.value)} placeholder="Ex: 2020" /></div>
          <div className="form-group"><label>N° Châssis / Série</label><input type="text" value={contractData.vehicle.serie} onChange={e => updateContract('vehicle.serie', e.target.value)} placeholder="VIN / Numéro de série" /></div>
          <div className="form-group"><label>Type Carburant</label>
            <select value={contractData.vehicle.fuelType} onChange={e => updateContract('vehicle.fuelType', e.target.value)}>
              <option value="essence">Essence</option><option value="diesel">Diesel</option>
              <option value="electrique">Électrique</option><option value="hybride">Hybride</option>
            </select>
          </div>
          <div className="form-group"><label>N° Police Assurance</label><input type="text" value={contractData.insurancePolicyNumber} onChange={e => updateContract('insurancePolicyNumber', e.target.value)} /></div>
          <div className="form-group"><label>Fin Assurance</label><input type="date" value={contractData.vehicle.insuranceEnd} onChange={e => updateContract('vehicle.insuranceEnd', e.target.value)} /></div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">État Initial</div>
        <div className="form-grid">
          <div className="form-group"><label>Kilométrage au départ</label><input type="number" value={contractData.vehicle.startKm} onChange={e => updateContract('vehicle.startKm', Number(e.target.value))} min={0} /></div>
        </div>
        <div className="form-group">
          <label>Niveau de Carburant</label>
          <div className="radio-group">
            {['plein', '3/4', '1/2', '1/4', 'vide'].map(level => (
              <div key={level} className="radio-option">
                <input type="radio" id={`f-${level}`} value={level} checked={contractData.vehicle.fuelLevel === level} onChange={() => updateContract('vehicle.fuelLevel', level)} />
                <label htmlFor={`f-${level}`}>{level === 'plein' ? 'Plein' : level === 'vide' ? 'Vide' : level}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Kilométrage</label>
          <div className="radio-group">
            <div className="radio-option"><input type="radio" id="km-lim" value="limited" checked={mileageType === 'limited'} onChange={() => setMileageType('limited')} /><label htmlFor="km-lim">Limité</label></div>
            <div className="radio-option"><input type="radio" id="km-unl" value="unlimited" checked={mileageType === 'unlimited'} onChange={() => setMileageType('unlimited')} /><label htmlFor="km-unl">Illimité</label></div>
          </div>
        </div>
        {mileageType === 'limited' && (
          <div className="form-group"><label>Limite Km/jour</label><input type="number" value={contractData.dailyKmLimit} onChange={e => updateContract('dailyKmLimit', Number(e.target.value))} min={0} /></div>
        )}

        <div className="section-title" style={{ marginTop: '18px' }}>Équipements</div>
        <div className="checkbox-grid">
          {[
            { key: 'hasSpareWheel', label: 'Roue de secours' }, { key: 'hasHorn', label: 'Klaxon' },
            { key: 'hasBodyCheck', label: 'Carrosserie OK' }, { key: 'hasLightsCheck', label: 'Éclairage OK' },
            { key: 'hasInteriorCheck', label: 'Intérieur OK' }, { key: 'hasJack', label: 'Cric' },
            { key: 'hasWipers', label: 'Essuie-glaces' }, { key: 'hasLighter', label: 'Allume-cigare' },
            { key: 'hasRadio', label: 'Radio' }
          ].map(eq => (
            <div key={eq.key} className="checkbox-item">
              <input type="checkbox" id={`ck-${eq.key}`} checked={(contractData.vehicle as any)[eq.key]}
                onChange={e => updateContract(`vehicle.${eq.key}`, e.target.checked)} />
              <label htmlFor={`ck-${eq.key}`}>{eq.label}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehicleTab;
