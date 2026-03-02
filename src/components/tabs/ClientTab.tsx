import React, { useState, useMemo } from 'react';
import { useApp, nationalities, legalForms, moroccanCities } from '@/contexts/AppContext';

const ClientTab: React.FC = () => {
  const { contractData, updateContract, clients, setClients } = useApp();
  const [clientType, setClientType] = useState<'physical' | 'legal'>('physical');
  const [clientSearch, setClientSearch] = useState('');
  const [sameDriverAsRenter, setSameDriverAsRenter] = useState(false);
  const [addDriver2, setAddDriver2] = useState(false);

  const isMoroccan = contractData.renter.nationality === 'MAROCAINE';

  const filteredClients = useMemo(() => {
    if (!clientSearch) return clients;
    const s = clientSearch.toLowerCase();
    return clients.filter(c => {
      if (c.type === 'physical') return ((c.firstName || '') + ' ' + (c.lastName || '')).toLowerCase().includes(s) || c.phone.includes(s);
      return (c.companyName || '').toLowerCase().includes(s) || (c.legalRepresentative || '').toLowerCase().includes(s) || c.phone.includes(s);
    });
  }, [clientSearch, clients]);

  const selectClient = (client: typeof clients[0]) => {
    if (client.type === 'physical') {
      setClientType('physical');
      updateContract('renter.type', 'physical');
      updateContract('renter.firstName', client.firstName || '');
      updateContract('renter.lastName', client.lastName || '');
      updateContract('renter.phone', client.phone);
      updateContract('renter.email', client.email);
      updateContract('renter.licenseNumber', client.licenseNumber || '');
    } else {
      setClientType('legal');
      updateContract('renter.type', 'legal');
      updateContract('renter.companyName', client.companyName || '');
      updateContract('renter.legalRepresentative', client.legalRepresentative || '');
      updateContract('renter.phone', client.phone);
      updateContract('renter.email', client.email);
    }
    setClientSearch('');
  };

  const addNewClient = () => {
    const hasName = clientType === 'physical'
      ? (contractData.renter.firstName && contractData.renter.lastName)
      : contractData.renter.companyName;
    if (!hasName) { alert('Veuillez remplir les informations du client'); return; }
    const nc: any = { id: Date.now(), type: clientType };
    if (clientType === 'physical') {
      Object.assign(nc, { firstName: contractData.renter.firstName, lastName: contractData.renter.lastName, phone: contractData.renter.phone, email: contractData.renter.email, licenseNumber: contractData.renter.licenseNumber });
    } else {
      Object.assign(nc, { companyName: contractData.renter.companyName, legalRepresentative: contractData.renter.legalRepresentative, phone: contractData.renter.phone, email: contractData.renter.email });
    }
    setClients(prev => [...prev, nc]);
    alert('Client ajouté avec succès !');
  };

  const handleSameDriver = (checked: boolean) => {
    setSameDriverAsRenter(checked);
    if (checked) {
      updateContract('driver1.firstName', contractData.renter.firstName);
      updateContract('driver1.lastName', contractData.renter.lastName);
      updateContract('driver1.birthDate', contractData.renter.birthDate);
      updateContract('driver1.nationality', contractData.renter.nationality);
      updateContract('driver1.licenseNumber', contractData.renter.licenseNumber);
      updateContract('driver1.phone', contractData.renter.phone);
    } else {
      updateContract('driver1.firstName', '');
      updateContract('driver1.lastName', '');
      updateContract('driver1.birthDate', '');
      updateContract('driver1.nationality', '');
      updateContract('driver1.licenseNumber', '');
      updateContract('driver1.phone', '');
    }
  };

  const handleNationalityChange = (val: string) => {
    updateContract('renter.nationality', val);
    if (val === 'MAROCAINE') {
      updateContract('renter.idType', 'cin');
      updateContract('renter.foreignLicense', false);
      updateContract('renter.country', 'Maroc');
    } else {
      updateContract('renter.idType', 'passport');
      updateContract('renter.foreignLicense', true);
    }
  };

  return (
    <div>
      {/* Client type toggle */}
      <div className="section">
        <div className="section-title">Type de Locataire</div>
        <div className="toggle-group">
          <button className={`toggle-btn ${clientType === 'physical' ? 'active' : ''}`} onClick={() => { setClientType('physical'); updateContract('renter.type', 'physical'); }}>Personne Physique</button>
          <button className={`toggle-btn ${clientType === 'legal' ? 'active' : ''}`} onClick={() => { setClientType('legal'); updateContract('renter.type', 'legal'); }}>Personne Morale</button>
        </div>
        <div className="form-group">
          <label>Rechercher un client existant</label>
          <div className="search-container">
            <input type="text" value={clientSearch} onChange={e => setClientSearch(e.target.value)} placeholder="Nom, prénom, société ou téléphone..." className="search-input" />
            <button className="btn btn-secondary" onClick={addNewClient}>➕ Sauvegarder client</button>
          </div>
          {clientSearch && filteredClients.length > 0 && (
            <div className="item-list">
              {filteredClients.map(c => (
                <div key={c.id} className="item" onClick={() => selectClient(c)}>
                  <strong>{c.type === 'physical' ? `${c.firstName} ${c.lastName}` : c.companyName}</strong>
                  <span style={{ color: 'var(--chrome)', fontSize: '12px', marginLeft: '10px' }}>{c.phone}</span>
                </div>
              ))}
            </div>
          )}
          {clientSearch && filteredClients.length === 0 && (
            <div style={{ padding: '10px', color: 'var(--chrome)', fontSize: '13px' }}>Aucun client trouvé</div>
          )}
        </div>
      </div>

      {/* Physical person info */}
      {clientType === 'physical' && (
        <div className="section">
          <div className="section-title">Informations Personnelles</div>
          <div className="form-grid">
            <div className="form-group"><label>Nom *</label><input type="text" value={contractData.renter.lastName} onChange={e => updateContract('renter.lastName', e.target.value)} placeholder="Nom de famille" /></div>
            <div className="form-group"><label>Prénom *</label><input type="text" value={contractData.renter.firstName} onChange={e => updateContract('renter.firstName', e.target.value)} placeholder="Prénom" /></div>
            <div className="form-group"><label>Date de naissance</label><input type="date" value={contractData.renter.birthDate} onChange={e => updateContract('renter.birthDate', e.target.value)} /></div>
            <div className="form-group"><label>Lieu de naissance</label><input type="text" value={contractData.renter.birthPlace} onChange={e => updateContract('renter.birthPlace', e.target.value)} placeholder="Ville de naissance" /></div>
            <div className="form-group">
              <label>Nationalité</label>
              <select value={contractData.renter.nationality} onChange={e => handleNationalityChange(e.target.value)}>
                {nationalities.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Type de document</label>
              <select value={contractData.renter.idType} onChange={e => updateContract('renter.idType', e.target.value)} disabled={isMoroccan}>
                <option value="cin">Carte d'Identité Nationale (CIN)</option>
                <option value="passport">Passeport</option>
                <option value="sejour">Titre de séjour</option>
              </select>
              {isMoroccan && <small className="form-note">CIN sélectionné automatiquement pour nationalité marocaine</small>}
            </div>
            <div className="form-group">
              <label>N° Document{isMoroccan ? ' *' : ''}</label>
              <input type="text" value={contractData.renter.idNumber} onChange={e => updateContract('renter.idNumber', e.target.value)}
                placeholder={contractData.renter.idType === 'cin' ? 'Ex: AB123456' : contractData.renter.idType === 'sejour' ? 'Ex: AB123456C' : 'Numéro passeport'} />
            </div>
          </div>
        </div>
      )}

      {/* Legal entity info */}
      {clientType === 'legal' && (
        <div className="section">
          <div className="section-title">Informations de la Société</div>
          <div className="form-grid">
            <div className="form-group"><label>Raison Sociale *</label><input type="text" value={contractData.renter.companyName} onChange={e => updateContract('renter.companyName', e.target.value)} placeholder="Nom de la société" /></div>
            <div className="form-group"><label>Forme Juridique</label>
              <select value={contractData.renter.entityType} onChange={e => updateContract('renter.entityType', e.target.value)}>
                <option value="">Sélectionner...</option>
                {legalForms.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Représentant Légal *</label><input type="text" value={contractData.renter.legalRepresentative} onChange={e => updateContract('renter.legalRepresentative', e.target.value)} placeholder="Nom du représentant" /></div>
            <div className="form-group"><label>Fonction</label><input type="text" value={contractData.renter.representativeFunction} onChange={e => updateContract('renter.representativeFunction', e.target.value)} placeholder="Ex: Directeur Général" /></div>
          </div>
        </div>
      )}

      {/* Contact info */}
      <div className="section">
        <div className="section-title">Coordonnées</div>
        <div className="form-grid">
          <div className="form-group full-width"><label>Adresse</label><input type="text" value={contractData.renter.address} onChange={e => updateContract('renter.address', e.target.value)} placeholder="Adresse complète" /></div>
          <div className="form-group"><label>Code Postal</label><input type="text" value={contractData.renter.postalCode} onChange={e => updateContract('renter.postalCode', e.target.value)} placeholder="Ex: 20000" /></div>
          <div className="form-group"><label>Ville</label>
            {isMoroccan ? (
              <select value={contractData.renter.city} onChange={e => updateContract('renter.city', e.target.value)}>
                <option value="">Sélectionner...</option>
                {moroccanCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            ) : (
              <input type="text" value={contractData.renter.city} onChange={e => updateContract('renter.city', e.target.value)} placeholder="Ville" />
            )}
          </div>
          <div className="form-group"><label>Pays</label><input type="text" value={contractData.renter.country} onChange={e => updateContract('renter.country', e.target.value)} readOnly={isMoroccan} /></div>
          <div className="form-group"><label>Téléphone *</label><input type="tel" value={contractData.renter.phone} onChange={e => updateContract('renter.phone', e.target.value)} placeholder="Ex: 0661234567" /></div>
          <div className="form-group"><label>Email</label><input type="email" value={contractData.renter.email} onChange={e => updateContract('renter.email', e.target.value)} placeholder="email@exemple.ma" /></div>
        </div>
      </div>

      {/* License */}
      {clientType === 'physical' && (
        <div className="section">
          <div className="section-title">Permis de Conduire</div>
          <div className="form-grid">
            <div className="form-group">
              <label>N° Permis{isMoroccan ? ' *' : ''}</label>
              <input type="text" value={contractData.renter.licenseNumber} onChange={e => updateContract('renter.licenseNumber', e.target.value)}
                placeholder={contractData.renter.foreignLicense ? 'Format libre' : 'Ex: 12/3456789'} />
            </div>
            <div className="form-group"><label>Date d'Obtention</label><input type="date" value={contractData.renter.licenseDate} onChange={e => updateContract('renter.licenseDate', e.target.value)} /></div>
            <div className="form-group"><label>Délivré par</label><input type="text" value={contractData.renter.licenseAuthority} onChange={e => updateContract('renter.licenseAuthority', e.target.value)} placeholder="Autorité délivrante" /></div>
            <div className="form-group">
              <div className="checkbox-item">
                <input type="checkbox" id="foreign-lic" checked={contractData.renter.foreignLicense} onChange={e => updateContract('renter.foreignLicense', e.target.checked)} />
                <label htmlFor="foreign-lic">Permis étranger</label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drivers */}
      <div className="section">
        <div className="section-title">Conducteurs</div>
        {clientType === 'physical' && (
          <div className="checkbox-item mb-20">
            <input type="checkbox" id="same-driver" checked={sameDriverAsRenter} onChange={e => handleSameDriver(e.target.checked)} />
            <label htmlFor="same-driver">Le locataire est aussi le conducteur principal</label>
          </div>
        )}
        {(clientType === 'legal' || !sameDriverAsRenter) && (
          <>
            <h4 style={{ marginBottom: '14px', fontSize: '13px', color: 'var(--text-s)', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'var(--font-m)' }}>
              Conducteur Principal{clientType === 'legal' ? ' *' : ''}
            </h4>
            <div className="form-grid">
              <div className="form-group"><label>Nom</label><input type="text" value={contractData.driver1.lastName} onChange={e => updateContract('driver1.lastName', e.target.value)} placeholder="Nom" /></div>
              <div className="form-group"><label>Prénom</label><input type="text" value={contractData.driver1.firstName} onChange={e => updateContract('driver1.firstName', e.target.value)} placeholder="Prénom" /></div>
              <div className="form-group"><label>Date de naissance</label><input type="date" value={contractData.driver1.birthDate} onChange={e => updateContract('driver1.birthDate', e.target.value)} /></div>
              <div className="form-group"><label>Nationalité</label><input type="text" value={contractData.driver1.nationality} onChange={e => updateContract('driver1.nationality', e.target.value)} placeholder="Nationalité" /></div>
              <div className="form-group"><label>N° Permis</label><input type="text" value={contractData.driver1.licenseNumber} onChange={e => updateContract('driver1.licenseNumber', e.target.value)} placeholder="Numéro de permis" /></div>
              <div className="form-group"><label>Téléphone</label><input type="tel" value={contractData.driver1.phone} onChange={e => updateContract('driver1.phone', e.target.value)} placeholder="Téléphone" /></div>
            </div>
          </>
        )}
        <div style={{ marginTop: '14px' }}>
          <div className="checkbox-item">
            <input type="checkbox" id="add-driver2" checked={addDriver2} onChange={e => setAddDriver2(e.target.checked)} />
            <label htmlFor="add-driver2">Ajouter un 2ème conducteur</label>
          </div>
        </div>
        {addDriver2 && (
          <>
            <h4 style={{ marginTop: '14px', marginBottom: '14px', fontSize: '13px', color: 'var(--text-s)', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'var(--font-m)' }}>Conducteur Secondaire</h4>
            <div className="form-grid">
              <div className="form-group"><label>Nom</label><input type="text" value={contractData.driver2.lastName} onChange={e => updateContract('driver2.lastName', e.target.value)} placeholder="Nom" /></div>
              <div className="form-group"><label>Prénom</label><input type="text" value={contractData.driver2.firstName} onChange={e => updateContract('driver2.firstName', e.target.value)} placeholder="Prénom" /></div>
              <div className="form-group"><label>N° Permis</label><input type="text" value={contractData.driver2.licenseNumber} onChange={e => updateContract('driver2.licenseNumber', e.target.value)} placeholder="Numéro de permis" /></div>
              <div className="form-group"><label>Téléphone</label><input type="tel" value={contractData.driver2.phone} onChange={e => updateContract('driver2.phone', e.target.value)} placeholder="Téléphone" /></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClientTab;
