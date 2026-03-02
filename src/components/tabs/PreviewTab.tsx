import React, { useMemo, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';

const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('fr-FR') : '';
const formatDateTime = (d: string) => d ? new Date(d).toLocaleString('fr-FR') : '';

const PreviewTab: React.FC = () => {
  const { contractData, agencyProfile } = useApp();
  const previewRef = useRef<HTMLDivElement>(null);

  const rentalDays = useMemo(() => {
    if (!contractData.rentalStart || !contractData.rentalEnd) return 0;
    const diff = new Date(contractData.rentalEnd).getTime() - new Date(contractData.rentalStart).getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [contractData.rentalStart, contractData.rentalEnd]);
  const totalAmount = rentalDays * contractData.dailyRate;

  const generatePDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');
      const el = previewRef.current;
      if (!el) { alert('Aperçu non disponible'); return; }
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const w = pdf.internal.pageSize.getWidth();
      const h = canvas.height * w / canvas.width;
      const pageH = pdf.internal.pageSize.getHeight();
      let heightLeft = h, pos = 0;
      pdf.addImage(imgData, 'PNG', 0, pos, w, h);
      heightLeft -= pageH;
      while (heightLeft > 0) { pos -= pageH; pdf.addPage(); pdf.addImage(imgData, 'PNG', 0, pos, w, h); heightLeft -= pageH; }
      pdf.save(`contrat-${contractData.contractNumber}.pdf`);
    } catch (e: any) { alert('Erreur génération PDF : ' + e.message); }
  };

  return (
    <div>
      <div className="btn-group" style={{ marginBottom: '18px' }}>
        <button onClick={generatePDF} className="btn btn-primary">📄 Générer PDF</button>
      </div>
      <div className="contract-preview" ref={previewRef}>
        <div className="preview-header">
          {agencyProfile.logo && <div style={{ marginBottom: '14px' }}><img src={agencyProfile.logo} style={{ maxHeight: '76px', maxWidth: '190px' }} alt="Logo" /></div>}
          <h2>CONTRAT DE LOCATION DE VÉHICULE</h2>
          <p><strong>N° {contractData.contractNumber}</strong> — Date : {formatDate(contractData.contractDate)}</p>
        </div>
        <div className="preview-section">
          <div className="preview-section-title">🏢 Bailleur</div>
          <p><strong>{contractData.owner.companyName}</strong></p>
          <p>{contractData.owner.address}</p>
          <p>Responsable : {contractData.owner.responsibleName} — {contractData.owner.responsibleFunction}</p>
          <p>Tél : {agencyProfile.contact.phone} | Email : {agencyProfile.contact.email}</p>
        </div>
        <div className="preview-section">
          <div className="preview-section-title">👤 Locataire</div>
          {contractData.renter.type === 'physical' ? (
            <>
              <p><strong>{contractData.renter.lastName} {contractData.renter.firstName}</strong></p>
              {contractData.renter.birthDate && <p>Né(e) le {formatDate(contractData.renter.birthDate)}{contractData.renter.birthPlace ? ' à ' + contractData.renter.birthPlace : ''}</p>}
              <p>Nationalité : {contractData.renter.nationality}</p>
              <p>{contractData.renter.idType.toUpperCase()} : {contractData.renter.idNumber}</p>
              {contractData.renter.licenseNumber && <p>Permis N° : {contractData.renter.licenseNumber}</p>}
            </>
          ) : (
            <>
              <p><strong>{contractData.renter.companyName}</strong> ({contractData.renter.entityType})</p>
              <p>Représenté par : {contractData.renter.legalRepresentative} — {contractData.renter.representativeFunction}</p>
            </>
          )}
          <p>{contractData.renter.address}{contractData.renter.city ? ', ' + contractData.renter.city : ''}{contractData.renter.country ? ', ' + contractData.renter.country : ''}</p>
          <p>Tél : {contractData.renter.phone}{contractData.renter.email ? ' | ' + contractData.renter.email : ''}</p>
        </div>
        {contractData.driver1.firstName && (
          <div className="preview-section">
            <div className="preview-section-title">🚘 Conducteur Principal</div>
            <p><strong>{contractData.driver1.lastName} {contractData.driver1.firstName}</strong></p>
            {contractData.driver1.nationality && <p>Nationalité : {contractData.driver1.nationality}</p>}
            <p>Permis N° : {contractData.driver1.licenseNumber}</p>
            {contractData.driver1.phone && <p>Tél : {contractData.driver1.phone}</p>}
          </div>
        )}
        <div className="preview-section">
          <div className="preview-section-title">🚗 Véhicule</div>
          <p><strong>{contractData.vehicle.model}</strong> — Immat. : {contractData.vehicle.plate}</p>
          <p>Couleur : {contractData.vehicle.color} | Mise en circulation : {contractData.vehicle.firstCirculationDate}</p>
          <p>Carburant : {contractData.vehicle.fuelType} | Niveau départ : {contractData.vehicle.fuelLevel}</p>
          <p>Kilométrage départ : {contractData.vehicle.startKm} km</p>
          <p>N° Police assurance : {contractData.insurancePolicyNumber}</p>
          <p>Équipements :
            {contractData.vehicle.hasSpareWheel && ' ✓ Roue secours'}
            {contractData.vehicle.hasJack && ' ✓ Cric'}
            {contractData.vehicle.hasRadio && ' ✓ Radio'}
            {contractData.vehicle.hasWipers && ' ✓ Essuie-glaces'}
          </p>
        </div>
        <div className="preview-section">
          <div className="preview-section-title">📅 Conditions de Location</div>
          <p>Départ : <strong>{formatDateTime(contractData.rentalStart)}</strong></p>
          <p>Retour : <strong>{formatDateTime(contractData.rentalEnd)}</strong></p>
          <p>Durée : <strong>{rentalDays} jour(s)</strong></p>
          <p>Tarif journalier : {contractData.dailyRate} Dhs | <strong>Total : {totalAmount} Dhs</strong></p>
          <p>Caution : {contractData.depositAmount} Dhs</p>
        </div>
        {contractData.damages.length > 0 && (
          <div className="preview-section">
            <div className="preview-section-title">🔧 Dégâts Existants</div>
            {contractData.damages.map((d, i) => (
              <div key={i} style={{ padding: '4px 0', borderBottom: '1px dashed #ddd' }}>
                <strong>#{i + 1} ({d.position}) :</strong> {d.description}
              </div>
            ))}
          </div>
        )}
        {(contractData.exteriorState || contractData.interiorState) && (
          <div className="preview-section">
            <div className="preview-section-title">📝 État du Véhicule</div>
            {contractData.exteriorState && <p><strong>Extérieur :</strong> {contractData.exteriorState}</p>}
            {contractData.interiorState && <p><strong>Intérieur :</strong> {contractData.interiorState}</p>}
          </div>
        )}
        <div className="preview-section">
          <div className="preview-section-title">✍️ Signatures</div>
          <div className="signature-grid" style={{ marginTop: '18px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 700, marginBottom: '8px' }}>Le Bailleur</p>
              <div style={{ height: '76px', border: '2px solid #111', borderRadius: '6px', margin: '8px 0' }} />
              <p style={{ fontSize: '12px' }}>{contractData.owner.responsibleName}</p>
              <p style={{ fontSize: '11px', color: '#666' }}>{contractData.owner.responsibleFunction}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 700, marginBottom: '8px' }}>Le Locataire</p>
              <div style={{ height: '76px', border: '2px solid #111', borderRadius: '6px', margin: '8px 0' }} />
              <p style={{ fontSize: '12px' }}>{contractData.renter.type === 'physical' ? `${contractData.renter.lastName} ${contractData.renter.firstName}` : contractData.renter.companyName}</p>
              <p style={{ fontSize: '11px', color: '#666' }}>Lu et approuvé</p>
            </div>
          </div>
          <p style={{ fontSize: '11px', color: '#888', textAlign: 'center', marginTop: '18px' }}>
            En signant ce contrat, les deux parties reconnaissent avoir lu et accepté l'ensemble des conditions générales de location.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreviewTab;
