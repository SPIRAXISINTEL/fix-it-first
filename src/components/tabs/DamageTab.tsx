import React, { useState } from 'react';
import { useApp, type Damage } from '@/contexts/AppContext';

const DamageTab: React.FC = () => {
  const { contractData, setContractData, updateContract } = useApp();
  const [newDamageDesc, setNewDamageDesc] = useState('');

  const positions: Record<string, { x: number; y: number }> = {
    'Avant': { x: 155, y: 5 }, 'Arrière': { x: 155, y: 165 },
    'Côté gauche': { x: 5, y: 85 }, 'Côté droit': { x: 315, y: 85 }, 'Toit': { x: 175, y: 50 }
  };

  const addDamageToPart = (position: string) => {
    if (!newDamageDesc.trim()) { setNewDamageDesc(position + ' — '); return; }
    const pos = positions[position] || { x: 175, y: 90 };
    const damage: Damage = {
      position, description: newDamageDesc.trim(),
      x: pos.x + Math.floor(Math.random() * 15) - 7,
      y: pos.y + Math.floor(Math.random() * 15) - 7
    };
    setContractData(prev => ({ ...prev, damages: [...prev.damages, damage] }));
    setNewDamageDesc('');
  };

  const removeDamage = (i: number) => {
    setContractData(prev => ({ ...prev, damages: prev.damages.filter((_, idx) => idx !== i) }));
  };

  return (
    <div>
      <div className="section">
        <div className="section-title">Relevé des Dégâts</div>
        <p style={{ fontSize: '13px', color: 'var(--chrome)', marginBottom: '18px' }}>Décrivez un dégât dans le champ ci-dessous, puis cliquez sur la zone correspondante du véhicule.</p>
        <div className="form-group">
          <label>Description du dégât</label>
          <input type="text" value={newDamageDesc} onChange={e => setNewDamageDesc(e.target.value)} placeholder="Ex: Rayure porte avant gauche, bosse pare-choc..." />
        </div>
        <div className="car-schema-container">
          <div className="car-schema">
            <svg width="350" height="200" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
              <rect x="50" y="40" width="250" height="120" rx="10" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <rect x="80" y="20" width="190" height="60" rx="8" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <rect x="30" y="50" width="40" height="30" rx="5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <rect x="280" y="50" width="40" height="30" rx="5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <text x="175" y="115" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.25)" fontFamily="'DM Mono',monospace">← Gauche | Droite →</text>
            </svg>
            <div className="car-part" style={{ top: '-15px', left: '160px' }} onClick={() => addDamageToPart('Avant')} title="Avant">AV</div>
            <div className="car-part" style={{ bottom: '-15px', left: '160px' }} onClick={() => addDamageToPart('Arrière')} title="Arrière">AR</div>
            <div className="car-part" style={{ top: '85px', left: '-15px' }} onClick={() => addDamageToPart('Côté gauche')} title="Côté gauche">G</div>
            <div className="car-part" style={{ top: '85px', right: '-15px' }} onClick={() => addDamageToPart('Côté droit')} title="Côté droit">D</div>
            <div className="car-part" style={{ top: '30px', left: '175px' }} onClick={() => addDamageToPart('Toit')} title="Toit">T</div>
            {contractData.damages.map((d, i) => (
              <div key={i} className="damage-marker" style={{ left: `${d.x}px`, top: `${d.y}px` }} title={`${d.position}: ${d.description}`}>{i + 1}</div>
            ))}
          </div>
          <p style={{ fontSize: '11px', color: 'var(--chrome)', textAlign: 'center', fontFamily: 'var(--font-m)', letterSpacing: '.5px' }}>Cliquez sur une zone (AV / AR / G / D / T) pour localiser un dégât</p>
        </div>
        {contractData.damages.length > 0 ? (
          <div className="damage-list">
            {contractData.damages.map((d, i) => (
              <div key={i} className="damage-item">
                <span><strong style={{ color: 'var(--accent-hot)' }}>#{i + 1} {d.position} :</strong> {d.description}</span>
                <button className="btn btn-sm btn-secondary" onClick={() => removeDamage(i)}>✕</button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--chrome)', fontSize: '13px', textAlign: 'center', padding: '18px', fontFamily: 'var(--font-m)' }}>Aucun dégât enregistré</p>
        )}
      </div>
      <div className="section">
        <div className="section-title">État Général</div>
        <div className="form-grid">
          <div className="form-group full-width"><label>État extérieur</label><textarea value={contractData.exteriorState} onChange={e => updateContract('exteriorState', e.target.value)} placeholder="Description de l'état extérieur du véhicule..." /></div>
          <div className="form-group full-width"><label>État intérieur</label><textarea value={contractData.interiorState} onChange={e => updateContract('interiorState', e.target.value)} placeholder="Description de l'état intérieur du véhicule..." /></div>
          <div className="form-group full-width"><label>Remarques générales</label><textarea value={contractData.vehicleStateBefore} onChange={e => updateContract('vehicleStateBefore', e.target.value)} placeholder="Autres remarques sur l'état du véhicule..." /></div>
        </div>
      </div>
    </div>
  );
};

export default DamageTab;
