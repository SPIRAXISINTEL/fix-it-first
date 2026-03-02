import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { moroccanProvinces } from '@/contexts/AppContext';

const AgencyWizard: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setAgencyProfile, startGpsSimulation } = useApp();
  const [step, setStep] = useState(1);
  const [entity, setEntity] = useState({ legalPersonType: '', companyName: '', fiscalId: '', ice: '', province: '', address: '', phone: '' });
  const [account, setAccount] = useState({ responsibleName: '', email: '', responsiblePhone: '', position: '' });
  const [settings, setSettings] = useState({ defaultCurrency: 'MAD', businessHours: '8h-18h', maxRentalDays: 30, depositPercentage: 20 });
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const nextStep = () => {
    if (step === 3) {
      const pw = 'Tmp' + Math.floor(Math.random() * 9000 + 1000) + '!';
      setCredentials({ email: account.email || 'admin@agence.ma', password: pw });
    }
    if (step < 4) setStep(step + 1);
  };

  const completeSetup = () => {
    setAgencyProfile(prev => ({
      ...prev,
      companyInfo: { ...prev.companyInfo, name: entity.companyName || prev.companyInfo.name },
      contact: { ...prev.contact, responsibleName: account.responsibleName || prev.contact.responsibleName }
    }));
    login('admin@admin.ma', 'admin');
    startGpsSimulation();
    navigate('/dashboard');
  };

  return (
    <div className="agency-wizard">
      <div className="wizard-header">
        <button onClick={() => navigate('/')} className="back-btn">← Retour</button>
        <h1>CRÉATION DE PROFIL AGENCE</h1>
        <div className="wizard-progress">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`progress-step ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>{s}</div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="wizard-step">
          <h2>Entité Légale</h2>
          <div className="form-grid">
            <div className="form-group"><label>Type Juridique *</label>
              <select value={entity.legalPersonType} onChange={e => setEntity({ ...entity, legalPersonType: e.target.value })}>
                <option value="">Sélectionner...</option>
                <option value="sarl">SARL</option><option value="sa">SA</option>
                <option value="sas">SAS</option><option value="eurl">EURL</option>
              </select>
            </div>
            <div className="form-group"><label>Dénomination Sociale *</label>
              <input type="text" value={entity.companyName} onChange={e => setEntity({ ...entity, companyName: e.target.value })} placeholder="Ex: MOBILUS Location SARL" />
            </div>
            <div className="form-group"><label>Identifiant Fiscal *</label>
              <input type="text" value={entity.fiscalId} onChange={e => setEntity({ ...entity, fiscalId: e.target.value })} placeholder="IF12345678" />
            </div>
            <div className="form-group"><label>N° ICE *</label>
              <input type="text" value={entity.ice} onChange={e => setEntity({ ...entity, ice: e.target.value })} placeholder="000000000000000 (15 chiffres)" />
            </div>
            <div className="form-group"><label>Province / Région *</label>
              <select value={entity.province} onChange={e => setEntity({ ...entity, province: e.target.value })}>
                <option value="">Sélectionner...</option>
                {moroccanProvinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Téléphone *</label>
              <input type="tel" value={entity.phone} onChange={e => setEntity({ ...entity, phone: e.target.value })} placeholder="0522.XX.XX.XX" />
            </div>
            <div className="form-group full-width"><label>Adresse Complète *</label>
              <textarea value={entity.address} onChange={e => setEntity({ ...entity, address: e.target.value })} placeholder="Numéro, Rue, Quartier, Ville" />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="wizard-step">
          <h2>Compte Gérant</h2>
          <div className="form-grid">
            <div className="form-group"><label>Nom Complet *</label>
              <input type="text" value={account.responsibleName} onChange={e => setAccount({ ...account, responsibleName: e.target.value })} placeholder="Prénom Nom" />
            </div>
            <div className="form-group"><label>Email Professionnel *</label>
              <input type="email" value={account.email} onChange={e => setAccount({ ...account, email: e.target.value })} placeholder="gerant@agence.ma" />
            </div>
            <div className="form-group"><label>Téléphone *</label>
              <input type="tel" value={account.responsiblePhone} onChange={e => setAccount({ ...account, responsiblePhone: e.target.value })} placeholder="0661.XX.XX.XX" />
            </div>
            <div className="form-group"><label>Fonction *</label>
              <select value={account.position} onChange={e => setAccount({ ...account, position: e.target.value })}>
                <option value="">Sélectionner...</option>
                <option value="Directeur Général">Directeur Général</option>
                <option value="Gérant">Gérant</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="wizard-step">
          <h2>Paramètres de l'Agence</h2>
          <div className="form-grid">
            <div className="form-group"><label>Devise *</label>
              <select value={settings.defaultCurrency} onChange={e => setSettings({ ...settings, defaultCurrency: e.target.value })}>
                <option value="MAD">Dirham Marocain (MAD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="USD">Dollar US (USD)</option>
              </select>
            </div>
            <div className="form-group"><label>Horaires d'Ouverture</label>
              <input type="text" value={settings.businessHours} onChange={e => setSettings({ ...settings, businessHours: e.target.value })} placeholder="8h00 - 18h00" />
            </div>
            <div className="form-group"><label>Durée Max Location (jours)</label>
              <input type="number" value={settings.maxRentalDays} onChange={e => setSettings({ ...settings, maxRentalDays: Number(e.target.value) })} min={1} />
            </div>
            <div className="form-group"><label>Caution (%)</label>
              <input type="number" value={settings.depositPercentage} onChange={e => setSettings({ ...settings, depositPercentage: Number(e.target.value) })} min={0} max={100} />
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="wizard-step">
          <div className="confirmation-success">
            <div className="success-icon">✅</div>
            <h2 style={{ fontFamily: 'var(--font-d)', fontSize: '14px', letterSpacing: '3px', color: 'var(--text-p)' }}>AGENCE CRÉÉE AVEC SUCCÈS</h2>
            <div className="credentials-box">
              <h3>Vos identifiants de connexion :</h3>
              <div className="credentials">
                <strong>Email :</strong> {credentials.email}<br />
                <strong>Mot de passe temporaire :</strong> {credentials.password}
              </div>
              <p className="note">⚠️ Conservez ces identifiants. Un email de confirmation vous a été envoyé.</p>
            </div>
          </div>
        </div>
      )}

      <div className="wizard-buttons">
        {step > 1 && step < 4 && <button onClick={() => setStep(step - 1)} className="btn btn-secondary">← PRÉCÉDENT</button>}
        {step < 4 && <button onClick={nextStep} className="btn btn-primary">SUIVANT →</button>}
        {step === 4 && <button onClick={completeSetup} className="btn btn-primary">ACCÉDER AU SYSTÈME ⟶</button>}
      </div>
    </div>
  );
};

export default AgencyWizard;
