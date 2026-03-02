import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import ClientTab from '@/components/tabs/ClientTab';
import VehicleTab from '@/components/tabs/VehicleTab';
import ContractTab from '@/components/tabs/ContractTab';
import DamageTab from '@/components/tabs/DamageTab';
import GpsTab from '@/components/tabs/GpsTab';
import PreviewTab from '@/components/tabs/PreviewTab';
import AgencyTab from '@/components/tabs/AgencyTab';
import ImportModal from '@/components/modals/ImportModal';
import VehicleListModal from '@/components/modals/VehicleListModal';

const tabs = [
  { key: 'client', icon: '👤', label: 'Client' },
  { key: 'vehicle', icon: '🚗', label: 'Véhicule' },
  { key: 'contract', icon: '📋', label: 'Contrat' },
  { key: 'damage', icon: '🔧', label: 'État des lieux' },
  { key: 'gps', icon: '📡', label: 'Géolocalisation' },
  { key: 'preview', icon: '👁', label: 'Aperçu' },
  { key: 'agency-profile', icon: '🏢', label: 'Agence' },
];

const Dashboard: React.FC = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const { contractData, updateContract, startGpsSimulation } = useApp();
  const [currentTab, setCurrentTab] = useState('client');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showVehicleListModal, setShowVehicleListModal] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) { navigate('/'); return; }
    startGpsSimulation();
  }, [auth.isAuthenticated, navigate, startGpsSimulation]);

  const handleLogout = () => { logout(); navigate('/'); };

  if (!auth.isAuthenticated) return null;

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>🚗 MOBILUS — Gestion de Location de Véhicules</h1>
        <div className="header-actions">
          <button onClick={() => setShowImportModal(true)} className="btn btn-outline btn-sm">📁 IMPORTER CSV</button>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">DÉCONNEXION</button>
        </div>
        <div className="header-info">
          <div className="form-group">
            <label>N° Contrat</label>
            <input type="text" value={contractData.contractNumber} readOnly style={{ fontFamily: 'var(--font-d)', fontSize: '12px', letterSpacing: '1px' }} />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={contractData.contractDate} onChange={e => updateContract('contractDate', e.target.value)} />
          </div>
          <div className="form-group">
            <label>N° Police Assurance</label>
            <input type="text" value={contractData.insurancePolicyNumber} onChange={e => updateContract('insurancePolicyNumber', e.target.value)} />
          </div>
        </div>
        <div className="owner-info">
          <h3>Bailleur / Propriétaire</h3>
          <div className="form-grid">
            <div className="form-group" style={{ marginBottom: 0 }}><label>Société</label>
              <input type="text" value={contractData.owner.companyName} readOnly />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}><label>Responsable</label>
              <input type="text" value={contractData.owner.responsibleName} readOnly />
            </div>
            <div className="form-group full-width" style={{ marginBottom: 0 }}><label>Adresse</label>
              <input type="text" value={contractData.owner.address} readOnly />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-navigation">
        <div className="tab-buttons">
          {tabs.map(t => (
            <button key={t.key} className={`tab-button ${currentTab === t.key ? 'active' : ''}`} onClick={() => setCurrentTab(t.key)}>
              <span className="tab-icon">{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {currentTab === 'client' && <ClientTab />}
          {currentTab === 'vehicle' && <VehicleTab onShowList={() => setShowVehicleListModal(true)} />}
          {currentTab === 'contract' && <ContractTab onSwitchTab={setCurrentTab} />}
          {currentTab === 'damage' && <DamageTab />}
          {currentTab === 'gps' && <GpsTab />}
          {currentTab === 'preview' && <PreviewTab />}
          {currentTab === 'agency-profile' && <AgencyTab />}
        </div>
      </div>

      {showImportModal && <ImportModal onClose={() => setShowImportModal(false)} />}
      {showVehicleListModal && <VehicleListModal onClose={() => setShowVehicleListModal(false)} />}
    </div>
  );
};

export default Dashboard;
