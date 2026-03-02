import React, { useState } from 'react';
import { useApp, moroccanCities } from '@/contexts/AppContext';

const AgencyTab: React.FC = () => {
  const { agencyProfile, setAgencyProfile } = useApp();
  const [editing, setEditing] = useState(false);

  const updateField = (section: string, field: string, value: any) => {
    setAgencyProfile(prev => ({ ...prev, [section]: { ...(prev as any)[section], [field]: value } }));
  };

  const uploadLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const r = new FileReader();
      r.onload = (ev) => setAgencyProfile(prev => ({ ...prev, logo: ev.target?.result as string }));
      r.readAsDataURL(f);
    }
  };

  const occupationRate = agencyProfile.statistics.totalVehicles > 0
    ? Math.round((agencyProfile.statistics.activeContracts / agencyProfile.statistics.totalVehicles) * 100)
    : 0;

  return (
    <div>
      <div className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div className="section-title" style={{ marginBottom: 0, border: 'none', paddingBottom: 0 }}>Profil de l'Agence</div>
          <div>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="btn btn-primary btn-sm">✏️ Modifier</button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { setEditing(false); alert('Profil agence mis à jour !'); }} className="btn btn-primary btn-sm">💾 Sauvegarder</button>
                <button onClick={() => setEditing(false)} className="btn btn-secondary btn-sm">Annuler</button>
              </div>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          {agencyProfile.logo ? (
            <div style={{ marginBottom: '10px' }}>
              <img src={agencyProfile.logo} style={{ maxHeight: '95px', border: '1px solid var(--border-dim)', borderRadius: 'var(--r-md)', padding: '6px' }} alt="Logo" />
            </div>
          ) : (
            <div style={{ width: '90px', height: '90px', background: 'rgba(255,255,255,0.04)', border: '1px dashed var(--border-mid)', borderRadius: 'var(--r-md)', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--chrome)', fontSize: '11px', fontFamily: 'var(--font-m)' }}>LOGO</div>
          )}
          {editing && (
            <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
              📷 Changer logo<input type="file" onChange={uploadLogo} accept="image/*" style={{ display: 'none' }} />
            </label>
          )}
        </div>

        <div className="form-grid">
          <div className="form-group"><label>Nom de la Société</label><input type="text" value={agencyProfile.companyInfo.name} onChange={e => updateField('companyInfo', 'name', e.target.value)} readOnly={!editing} /></div>
          <div className="form-group"><label>Forme Juridique</label><input type="text" value={agencyProfile.companyInfo.legalForm} onChange={e => updateField('companyInfo', 'legalForm', e.target.value)} readOnly={!editing} /></div>
          <div className="form-group"><label>N° ICE</label><input type="text" value={agencyProfile.companyInfo.ice} onChange={e => updateField('companyInfo', 'ice', e.target.value)} readOnly={!editing} /></div>
          <div className="form-group"><label>Identifiant Fiscal</label><input type="text" value={agencyProfile.companyInfo.fiscalId} onChange={e => updateField('companyInfo', 'fiscalId', e.target.value)} readOnly={!editing} /></div>
          <div className="form-group"><label>Registre Commerce</label><input type="text" value={agencyProfile.companyInfo.commerceRegister} onChange={e => updateField('companyInfo', 'commerceRegister', e.target.value)} readOnly={!editing} /></div>
          <div className="form-group"><label>N° Patente</label><input type="text" value={agencyProfile.companyInfo.patentNumber} onChange={e => updateField('companyInfo', 'patentNumber', e.target.value)} readOnly={!editing} /></div>
          <div className="form-group full-width"><label>Adresse</label><input type="text" value={agencyProfile.companyInfo.address} onChange={e => updateField('companyInfo', 'address', e.target.value)} readOnly={!editing} /></div>
          <div className="form-group"><label>Ville</label>
            {editing ? (
              <select value={agencyProfile.companyInfo.city} onChange={e => updateField('companyInfo', 'city', e.target.value)}>
                {moroccanCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            ) : (
              <input type="text" value={agencyProfile.companyInfo.city} readOnly />
            )}
          </div>
          <div className="form-group"><label>Code Postal</label><input type="text" value={agencyProfile.companyInfo.postalCode} onChange={e => updateField('companyInfo', 'postalCode', e.target.value)} readOnly={!editing} /></div>
        </div>

        <div className="section-title" style={{ marginTop: '18px' }}>Contact</div>
        <div className="form-grid">
          <div className="form-group"><label>Responsable</label><input type="text" value={agencyProfile.contact.responsibleName} onChange={e => updateField('contact', 'responsibleName', e.target.value)} readOnly={!editing} /></div>
          <div className="form-group"><label>Fonction</label><input type="text" value={agencyProfile.contact.responsibleFunction} onChange={e => updateField('contact', 'responsibleFunction', e.target.value)} readOnly={!editing} /></div>
          <div className="form-group"><label>Téléphone</label><input type="text" value={agencyProfile.contact.phone} onChange={e => updateField('contact', 'phone', e.target.value)} readOnly={!editing} /></div>
          <div className="form-group"><label>Mobile</label><input type="text" value={agencyProfile.contact.mobile} onChange={e => updateField('contact', 'mobile', e.target.value)} readOnly={!editing} /></div>
          <div className="form-group"><label>Email</label><input type="email" value={agencyProfile.contact.email} onChange={e => updateField('contact', 'email', e.target.value)} readOnly={!editing} /></div>
          <div className="form-group"><label>Site Web</label><input type="text" value={agencyProfile.contact.website} onChange={e => updateField('contact', 'website', e.target.value)} readOnly={!editing} /></div>
        </div>

        <div className="section-title" style={{ marginTop: '18px' }}>Statistiques</div>
        <div className="form-grid">
          <div className="form-group"><label>Total Véhicules</label><input type="number" value={agencyProfile.statistics.totalVehicles} onChange={e => updateField('statistics', 'totalVehicles', Number(e.target.value))} readOnly={!editing} /></div>
          <div className="form-group"><label>Contrats Actifs</label><input type="number" value={agencyProfile.statistics.activeContracts} onChange={e => updateField('statistics', 'activeContracts', Number(e.target.value))} readOnly={!editing} /></div>
          <div className="form-group"><label>Locations ce Mois</label><input type="number" value={agencyProfile.statistics.monthlyRentals} onChange={e => updateField('statistics', 'monthlyRentals', Number(e.target.value))} readOnly={!editing} /></div>
          <div className="form-group"><label>Satisfaction Client</label><input type="number" value={agencyProfile.statistics.customerSatisfaction} onChange={e => updateField('statistics', 'customerSatisfaction', Number(e.target.value))} step="0.1" max={5} readOnly={!editing} /></div>
          <div className="form-group"><label>Taux d'Occupation</label>
            <input type="text" value={`${occupationRate}%`} readOnly style={{ fontFamily: 'var(--font-d)', fontSize: '13px', color: 'var(--accent-hot)' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyTab;
