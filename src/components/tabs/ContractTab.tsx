import React, { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';

interface Props { onSwitchTab: (tab: string) => void; }

const ContractTab: React.FC<Props> = ({ onSwitchTab }) => {
  const { contractData, updateContract } = useApp();

  const rentalDays = useMemo(() => {
    if (!contractData.rentalStart || !contractData.rentalEnd) return 0;
    const diff = new Date(contractData.rentalEnd).getTime() - new Date(contractData.rentalStart).getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [contractData.rentalStart, contractData.rentalEnd]);

  const totalAmount = rentalDays * contractData.dailyRate;

  const saveContract = () => {
    if (!contractData.vehicle.plate) { alert('Immatriculation du véhicule obligatoire'); return; }
    if (!contractData.rentalStart || !contractData.rentalEnd) { alert('Dates de location obligatoires'); return; }
    alert('Contrat enregistré avec succès !');
  };

  return (
    <div>
      <div className="section">
        <div className="section-title">Dates de Location</div>
        <div className="form-grid">
          <div className="form-group"><label>Date & Heure de Départ *</label><input type="datetime-local" value={contractData.rentalStart} onChange={e => updateContract('rentalStart', e.target.value)} /></div>
          <div className="form-group"><label>Date & Heure de Retour *</label><input type="datetime-local" value={contractData.rentalEnd} onChange={e => updateContract('rentalEnd', e.target.value)} /></div>
          <div className="form-group"><label>Durée calculée</label><input type="text" value={`${rentalDays} jour(s)`} readOnly style={{ fontFamily: 'var(--font-d)', fontSize: '13px' }} /></div>
          <div className="form-group"><label>Lieu de départ</label><input type="text" value={contractData.locationAddress} onChange={e => updateContract('locationAddress', e.target.value)} placeholder="Lieu de remise du véhicule" /></div>
        </div>
      </div>
      <div className="section">
        <div className="section-title">Tarification (MAD)</div>
        <div className="form-grid">
          <div className="form-group"><label>Tarif Journalier (Dhs)</label><input type="number" value={contractData.dailyRate} onChange={e => updateContract('dailyRate', Number(e.target.value))} min={0} /></div>
          <div className="form-group"><label>Montant Total</label><input type="text" value={`${totalAmount} Dhs`} readOnly style={{ fontFamily: 'var(--font-d)', fontSize: '15px', color: 'var(--accent-hot)' }} /></div>
          <div className="form-group"><label>Caution (Dhs)</label><input type="number" value={contractData.depositAmount} onChange={e => updateContract('depositAmount', Number(e.target.value))} min={0} /></div>
          <div className="form-group"><label>Km supplémentaire (Dhs/km)</label><input type="number" value={contractData.extraKmPrice} onChange={e => updateContract('extraKmPrice', Number(e.target.value))} min={0} /></div>
          <div className="form-group"><label>Heure supplémentaire (Dhs/h)</label><input type="number" value={contractData.lateHourPrice} onChange={e => updateContract('lateHourPrice', Number(e.target.value))} min={0} /></div>
        </div>
      </div>
      <div className="section">
        <div className="section-title">Conditions Générales</div>
        <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-dim)', borderRadius: 'var(--r-md)', padding: '18px', fontSize: '13px', lineHeight: '1.85', color: 'var(--text-s)' }}>
          <p><strong style={{ color: 'var(--text-p)' }}>1. UTILISATION DU VÉHICULE :</strong> Le véhicule est loué exclusivement pour un usage personnel ou professionnel légal sur le territoire marocain.</p>
          <p style={{ marginTop: '8px' }}><strong style={{ color: 'var(--text-p)' }}>2. CARBURANT :</strong> Le véhicule est remis avec le niveau de carburant indiqué. Il doit être restitué avec le même niveau.</p>
          <p style={{ marginTop: '8px' }}><strong style={{ color: 'var(--text-p)' }}>3. DOMMAGES :</strong> Le locataire est responsable de tout dommage causé au véhicule pendant la période de location.</p>
          <p style={{ marginTop: '8px' }}><strong style={{ color: 'var(--text-p)' }}>4. INFRACTIONS :</strong> Toute infraction au Code de la Route est à la charge exclusive du locataire.</p>
          <p style={{ marginTop: '8px' }}><strong style={{ color: 'var(--text-p)' }}>5. RESTITUTION :</strong> Le véhicule doit être restitué à la date et à l'heure convenues. Tout retard sera facturé.</p>
          <p style={{ marginTop: '8px' }}><strong style={{ color: 'var(--text-p)' }}>6. KILOMÉTRAGE :</strong> Limité à {contractData.dailyKmLimit} km/jour. Supplément: {contractData.extraKmPrice} Dhs/km.</p>
          <p style={{ marginTop: '8px' }}><strong style={{ color: 'var(--text-p)' }}>7. CAUTION :</strong> Une caution de {contractData.depositAmount} Dhs est requise.</p>
        </div>
      </div>
      <div className="btn-group">
        <button onClick={saveContract} className="btn btn-primary">💾 Enregistrer Contrat</button>
        <button onClick={() => window.location.reload()} className="btn btn-secondary">🔄 Réinitialiser</button>
        <button onClick={() => onSwitchTab('preview')} className="btn btn-outline">👁 Aperçu</button>
      </div>
    </div>
  );
};

export default ContractTab;
