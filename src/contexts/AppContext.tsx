import React, { createContext, useContext, useState, useMemo, useEffect, useRef, useCallback } from 'react';

/* ── Types ── */
export interface Client {
  id: number; type: 'physical' | 'legal';
  firstName?: string; lastName?: string;
  companyName?: string; legalRepresentative?: string;
  phone: string; email: string; licenseNumber?: string;
}

export interface Vehicle {
  id: number; brand: string; model: string; plate: string; color: string; year: number;
}

export interface GpsVehicle {
  id: number; brand: string; model: string; plate: string; color: string; emoji: string;
  status: 'disponible' | 'loue' | 'maintenance' | 'inactif';
  driver: string | null;
  gps: { lat: number; lng: number; speed: number; heading: number; altitude: number };
  mapX: number; mapY: number;
  fuel: number; battery: number; odometer: number;
  lastUpdate: string; phone: string;
  destination: string | null; distanceRestante: string | null; tempsEstime: string | null;
  alertes: { type: string; msg: string }[];
  routePoints: string | null;
}

export interface Damage {
  position: string; description: string; x: number; y: number;
}

export interface ContractData {
  registrationNumber: string; articleNumber: string; insurancePolicyNumber: string;
  contractNumber: string; contractDate: string;
  commercialCenter: string; mobNumber: string; locationAddress: string;
  owner: { companyName: string; address: string; responsibleName: string; responsibleFunction: string };
  renter: {
    type: 'physical' | 'legal'; firstName: string; lastName: string;
    birthDate: string; birthPlace: string; nationality: string;
    idType: string; idNumber: string;
    companyName: string; entityType: string; legalRepresentative: string; representativeFunction: string;
    address: string; postalCode: string; city: string; country: string;
    phone: string; email: string; licenseNumber: string; licenseDate: string; licenseAuthority: string;
    foreignLicense: boolean;
  };
  driver1: { firstName: string; lastName: string; birthDate: string; nationality: string; licenseNumber: string; phone: string };
  driver2: { firstName: string; lastName: string; licenseNumber: string; phone: string };
  vehicle: {
    model: string; plate: string; firstCirculationDate: string; type: string; serie: string;
    color: string; startKm: number; fuelLevel: string; insuranceEnd: string; fuelType: string;
    hasSpareWheel: boolean; hasHorn: boolean; hasBodyCheck: boolean; hasLightsCheck: boolean;
    hasInteriorCheck: boolean; hasJack: boolean; hasWipers: boolean; hasLighter: boolean; hasRadio: boolean;
  };
  rentalStart: string; rentalEnd: string;
  dailyRate: number; dailyKmLimit: number; extraKmPrice: number; lateHourPrice: number; depositAmount: number;
  damages: Damage[]; exteriorState: string; interiorState: string; vehicleStateBefore: string;
}

export interface AgencyProfile {
  logo: string | null;
  companyInfo: {
    name: string; legalForm: string; ice: string; fiscalId: string;
    commerceRegister: string; patentNumber: string; cnssNumber: string;
    address: string; postalCode: string; city: string; province: string; country: string;
  };
  contact: {
    responsibleName: string; responsibleFunction: string;
    phone: string; mobile: string; email: string; website: string; fax: string;
  };
  statistics: {
    totalVehicles: number; monthlyRentals: number; occupationRate: number;
    customerSatisfaction: number; activeContracts: number; totalRevenue: number;
  };
  settings: { currency: string; language: string; timezone: string; businessHours: string; workingDays: string };
}

function generateContractNumber() {
  const n = new Date();
  return `CTR-${n.getFullYear()}${String(n.getMonth() + 1).padStart(2, '0')}${String(n.getDate()).padStart(2, '0')}-${String(n.getHours()).padStart(2, '0')}${String(n.getMinutes()).padStart(2, '0')}`;
}

const initialContractData: ContractData = {
  registrationNumber: '', articleNumber: '16025326206', insurancePolicyNumber: '11A4889639',
  contractNumber: generateContractNumber(),
  contractDate: new Date().toISOString().split('T')[0],
  commercialCenter: '(Boulevard Mohammed V)', mobNumber: '0522.26.14.15/0522.26.14.18',
  locationAddress: 'Casablanca centre',
  owner: {
    companyName: 'MOBILUS Location de Véhicules SARL',
    address: 'Boulevard Mohammed V, Casablanca Centre, Maroc',
    responsibleName: 'M. Ahmed BENALI', responsibleFunction: 'Directeur Général'
  },
  renter: {
    type: 'physical', firstName: '', lastName: '', birthDate: '', birthPlace: '',
    nationality: 'MAROCAINE', idType: 'cin', idNumber: '',
    companyName: '', entityType: '', legalRepresentative: '', representativeFunction: '',
    address: '', postalCode: '', city: '', country: 'Maroc',
    phone: '', email: '', licenseNumber: '', licenseDate: '', licenseAuthority: '',
    foreignLicense: false
  },
  driver1: { firstName: '', lastName: '', birthDate: '', nationality: '', licenseNumber: '', phone: '' },
  driver2: { firstName: '', lastName: '', licenseNumber: '', phone: '' },
  vehicle: {
    model: 'TOYOTA YARIS HB', plate: '12345-أ-1', firstCirculationDate: '2020',
    type: '', serie: '', color: 'BLANC', startKm: 0, fuelLevel: 'plein',
    insuranceEnd: '', fuelType: 'essence',
    hasSpareWheel: true, hasHorn: true, hasBodyCheck: true, hasLightsCheck: true,
    hasInteriorCheck: true, hasJack: true, hasWipers: true, hasLighter: true, hasRadio: true
  },
  rentalStart: '', rentalEnd: '',
  dailyRate: 300, dailyKmLimit: 300, extraKmPrice: 2, lateHourPrice: 50, depositAmount: 3000,
  damages: [], exteriorState: '', interiorState: '', vehicleStateBefore: ''
};

const initialAgencyProfile: AgencyProfile = {
  logo: null,
  companyInfo: {
    name: 'MOBILUS Location de Véhicules', legalForm: 'SARL', ice: '002345678901234',
    fiscalId: 'IF12345678', commerceRegister: 'RC2023/B/12345', patentNumber: 'PV2023/001234',
    cnssNumber: 'CNSS789456123', address: 'Boulevard Mohammed V, Casablanca Centre',
    postalCode: '20000', city: 'Casablanca', province: 'Casablanca-Settat', country: 'Maroc'
  },
  contact: {
    responsibleName: 'M. Ahmed BENALI', responsibleFunction: 'Directeur Général',
    phone: '0522.26.14.15 / 0522.26.14.18', mobile: '0661.12.34.56',
    email: 'contact@mobilus-location.ma', website: 'https://www.mobilus-location.ma', fax: '0522.12.34.56'
  },
  statistics: { totalVehicles: 24, monthlyRentals: 156, occupationRate: 92, customerSatisfaction: 4.8, activeContracts: 18, totalRevenue: 245000 },
  settings: { currency: 'MAD', language: 'FR', timezone: 'GMT+1', businessHours: '8h00 - 18h00', workingDays: 'Lundi - Samedi' }
};

const initialClients: Client[] = [
  { id: 1, type: 'physical', firstName: 'Mohamed', lastName: 'Alami', phone: '0661234567', email: 'm.alami@example.com', licenseNumber: '12/3456789' },
  { id: 2, type: 'physical', firstName: 'Fatima', lastName: 'Benkirane', phone: '0662345678', email: 'f.benkirane@example.com', licenseNumber: '09/8765432' },
  { id: 3, type: 'legal', companyName: 'SARL AutoPlus', legalRepresentative: 'Ahmed Kader', phone: '0522112233', email: 'contact@autoplus.ma' },
  { id: 4, type: 'legal', companyName: 'STE Location Pro', legalRepresentative: 'Karim Nour', phone: '0522667788', email: 'info@locationpro.ma' }
];

const initialVehicles: Vehicle[] = [
  { id: 1, brand: 'TOYOTA', model: 'YARIS HB', plate: '12345-أ-1', color: 'BLANC', year: 2020 },
  { id: 2, brand: 'RENAULT', model: 'CLIO', plate: '23456-ب-2', color: 'ROUGE', year: 2019 },
  { id: 3, brand: 'PEUGEOT', model: '208', plate: '34567-ج-3', color: 'GRIS', year: 2021 },
  { id: 4, brand: 'HYUNDAI', model: 'i20', plate: '45678-د-4', color: 'NOIR', year: 2022 }
];

const initialGpsVehicles: GpsVehicle[] = [
  {
    id: 1, brand: 'TOYOTA', model: 'YARIS HB', plate: '12345-أ-1', color: 'BLANC', emoji: '🚗',
    status: 'loue', driver: 'Mohamed Alami',
    gps: { lat: 33.5731, lng: -7.5898, speed: 62, heading: 45, altitude: 48 },
    mapX: 42, mapY: 38, fuel: 72, battery: 65, odometer: 45230,
    lastUpdate: new Date().toISOString(), phone: '0661234567',
    destination: 'Marrakech', distanceRestante: '184 km', tempsEstime: '1h 52min',
    alertes: [], routePoints: 'M 42 65 Q 44 55 45 48 Q 46 42 42 38'
  },
  {
    id: 2, brand: 'RENAULT', model: 'CLIO', plate: '23456-ب-2', color: 'ROUGE', emoji: '🚙',
    status: 'disponible', driver: null,
    gps: { lat: 33.59, lng: -7.61, speed: 0, heading: 0, altitude: 52 },
    mapX: 28, mapY: 24, fuel: 88, battery: 92, odometer: 23100,
    lastUpdate: new Date().toISOString(), phone: '',
    destination: null, distanceRestante: null, tempsEstime: null, alertes: [], routePoints: null
  },
  {
    id: 3, brand: 'PEUGEOT', model: '208', plate: '34567-ج-3', color: 'GRIS', emoji: '🚘',
    status: 'maintenance', driver: null,
    gps: { lat: 33.55, lng: -7.55, speed: 0, heading: 0, altitude: 35 },
    mapX: 65, mapY: 62, fuel: 40, battery: 30, odometer: 78400,
    lastUpdate: new Date(Date.now() - 3600000).toISOString(), phone: '',
    destination: 'Garage Central', distanceRestante: null, tempsEstime: null,
    alertes: [{ type: 'maintenance', msg: 'Révision programmée' }], routePoints: null
  },
  {
    id: 4, brand: 'HYUNDAI', model: 'i20', plate: '45678-د-4', color: 'NOIR', emoji: '🚐',
    status: 'loue', driver: 'Fatima Benkirane',
    gps: { lat: 33.61, lng: -7.52, speed: 88, heading: 180, altitude: 55 },
    mapX: 72, mapY: 22, fuel: 55, battery: 78, odometer: 31500,
    lastUpdate: new Date().toISOString(), phone: '0662345678',
    destination: 'Agadir', distanceRestante: '448 km', tempsEstime: '4h 20min',
    alertes: [{ type: 'vitesse', msg: 'Vitesse élevée détectée' }], routePoints: 'M 72 48 Q 70 38 72 22'
  },
  {
    id: 5, brand: 'DACIA', model: 'DUSTER', plate: '56789-ه-5', color: 'BLANC', emoji: '🛻',
    status: 'disponible', driver: null,
    gps: { lat: 33.585, lng: -7.575, speed: 0, heading: 90, altitude: 50 },
    mapX: 52, mapY: 55, fuel: 95, battery: 88, odometer: 12200,
    lastUpdate: new Date().toISOString(), phone: '',
    destination: null, distanceRestante: null, tempsEstime: null, alertes: [], routePoints: null
  }
];

/* ── Reference Data ── */
export const nationalities = [
  'AFGHANE','ALBANAISE','ALGERIENNE','ALLEMANDE','AMERICAINE','ANDORRANE','ANGOLAISE',
  'ARGENTINE','ARMENIENNE','AUSTRALIENNE','AUTRICHIENNE','AZERBAIDJANAISE',
  'BAHREINIENNE','BANGLADAISE','BELGE','BENINOISE','BOLIVIENNE','BOSNIENNE','BRESILIENNE',
  'BRITANNIQUE','BULGARE','BURKINABEE','BIRMANE','BURUNDAISE','CAMBODGIENNE','CAMEROUNAISE',
  'CANADIENNE','CENTRAFRICAINE','CHILIENNE','CHINOISE','COLOMBIENNE','COMORIENNE','CONGOLAISE',
  'COSTARICAINE','CROATE','CUBAINE','CHYPRIOTE','TCHEQUE','DANOISE','DJIBOUTIENNE',
  'DOMINICAINE','NEERLANDAISE','EGYPTIENNE','EMIRIENNE','ERYTHREENNE','ESTONIENNE',
  'ETHIOPIENNE','FIDJIENNE','PHILIPPINE','FINLANDAISE','FRANCAISE','GABONAISE','GAMBIENNE',
  'GEORGIENNE','GHANEENNE','GUATEMALTEQUE','GUINEENNE','HAITIENNE','HONDURIENNE','HONGROISE',
  'INDIENNE','INDONESIENNE','IRANIENNE','IRAKIENNE','IRLANDAISE','ISLANDAISE','ISRAELIENNE',
  'ITALIENNE','IVOIRIENNE','JAMAICAINE','JAPONAISE','JORDANIENNE','KAZAKHE','KENYANE',
  'KOWEITIENNE','LAOTIENNE','LETTONE','LIBANAISE','LIBERIENNE','LIBYENNE','LITUANIENNE',
  'LUXEMBOURGEOISE','MACEDONIENNE','MALGACHE','MALAISIENNE','MALIENNE','MALTAISE',
  'MAROCAINE','MAURICIENNE','MAURITANIENNE','MEXICAINE','MOLDAVE','MONGOLE','MONTENEGRINE',
  'MOZAMBICAINE','NAMIBIENNE','NEPALAISE','NICARAGUAYENNE','NIGERIANE','NIGERIENNE',
  'NORVEGIENNE','NEO-ZELANDAISE','OMANAISE','OUGANDAISE','OUZBEKE','PAKISTANAISE',
  'PALESTINIENNE','PANAMEENNE','PARAGUAYENNE','PERUVIENNE','POLONAISE','PORTUGAISE',
  'QATARIENNE','ROUMAINE','RUSSE','RWANDAISE','SALVADORIENNE','SAOUDIENNE',
  'SENEGALAISE','SERBE','SEYCHELLOISE','SIERRA-LEONAISE','SINGAPOURIENNE',
  'SLOVAQUE','SLOVENE','SOMALIENNE','SOUDANAISE','SRI-LANKAISE','SUD-AFRICAINE',
  'SUD-COREENNE','SUEDOISE','SUISSE','SURINAMAISE','SYRIENNE','TADJIKE','TANZANIENNE',
  'TCHADIENNE','THAILANDAISE','TOGOLAISE','TRINIDADIENNE','TUNISIENNE','TURQUE',
  'UKRAINIENNE','URUGUAYENNE','VENEZUELIENNE','VIETNAMIENNE','YEMENITE','ZAMBIENNE','ZIMBABWEENNE'
];

export const legalForms = ['SARL','SA','SAS','EURL','GIE','SNC','Association','Établissement public'];

export const moroccanCities = [
  'Agadir','Al Hoceima','Beni Mellal','Berrechid','Casablanca','El Jadida','Errachidia',
  'Essaouira','Fès','Guelmim','Kénitra','Khouribga','Laâyoune','Larache','Marrakech',
  'Meknès','Mohammedia','Nador','Ouarzazate','Oujda','Rabat','Safi','Salé','Settat',
  'Tanger','Taroudant','Tétouan','Tiznit'
];

export const moroccanProvinces = [
  'Casablanca-Settat','Rabat-Salé-Kénitra','Marrakech-Safi','Fès-Meknès',
  'Tanger-Tétouan-Al Hoceima','Oriental','Souss-Massa','Béni Mellal-Khénifra',
  'Drâa-Tafilalet','Laâyoune-Sakia El Hamra','Dakhla-Oued Ed-Dahab','Guelmim-Oued Noun'
];

/* ── Context ── */
interface AppContextType {
  contractData: ContractData;
  setContractData: React.Dispatch<React.SetStateAction<ContractData>>;
  updateContract: (path: string, value: any) => void;
  agencyProfile: AgencyProfile;
  setAgencyProfile: React.Dispatch<React.SetStateAction<AgencyProfile>>;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  gpsVehicles: GpsVehicle[];
  setGpsVehicles: React.Dispatch<React.SetStateAction<GpsVehicle[]>>;
  selectedGpsVehicle: GpsVehicle | null;
  setSelectedGpsVehicle: React.Dispatch<React.SetStateAction<GpsVehicle | null>>;
  startGpsSimulation: () => void;
  stopGpsSimulation: () => void;
}

const AppContext = createContext<AppContextType | null>(null);
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contractData, setContractData] = useState<ContractData>(initialContractData);
  const [agencyProfile, setAgencyProfile] = useState<AgencyProfile>(initialAgencyProfile);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [gpsVehicles, setGpsVehicles] = useState<GpsVehicle[]>(initialGpsVehicles);
  const [selectedGpsVehicle, setSelectedGpsVehicle] = useState<GpsVehicle | null>(null);
  const intervalRef = useRef<number | null>(null);

  const updateContract = useCallback((path: string, value: any) => {
    setContractData(prev => {
      const next = { ...prev };
      const keys = path.split('.');
      let obj: any = next;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }, []);

  const startGpsSimulation = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = window.setInterval(() => {
      setGpsVehicles(prev => prev.map(v => {
        if (v.status !== 'loue') return v;
        const dx = (Math.random() - 0.5) * 1.5;
        const dy = (Math.random() - 0.5) * 1.5;
        const newSpeed = Math.round(Math.max(20, Math.min(130, v.gps.speed + (Math.random() - 0.5) * 12)));
        return {
          ...v,
          mapX: Math.max(5, Math.min(92, v.mapX + dx)),
          mapY: Math.max(5, Math.min(90, v.mapY + dy)),
          gps: { ...v.gps, speed: newSpeed },
          fuel: Math.max(5, v.fuel - 0.01),
          lastUpdate: new Date().toISOString()
        };
      }));
    }, 2500);
  }, []);

  const stopGpsSimulation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => () => stopGpsSimulation(), [stopGpsSimulation]);

  return (
    <AppContext.Provider value={{
      contractData, setContractData, updateContract,
      agencyProfile, setAgencyProfile,
      clients, setClients, vehicles, setVehicles,
      gpsVehicles, setGpsVehicles,
      selectedGpsVehicle, setSelectedGpsVehicle,
      startGpsSimulation, stopGpsSimulation
    }}>
      {children}
    </AppContext.Provider>
  );
};
