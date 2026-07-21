/** Base d'entreprises qui recrutent des alternants dev en France (nom, secteur, ville). */
export interface Company { name: string; sector: string; city: string; }

export const COMPANIES: Company[] = [
  // ESN / conseil
  { name: 'Capgemini', sector: 'ESN / conseil', city: 'Paris' },
  { name: 'Sopra Steria', sector: 'ESN / conseil', city: 'Paris / Lyon' },
  { name: 'Atos', sector: 'ESN', city: 'Bezons' },
  { name: 'Inetum', sector: 'ESN', city: 'Paris' },
  { name: 'CGI', sector: 'ESN', city: 'Paris' },
  { name: 'Devoteam', sector: 'Conseil tech', city: 'Levallois' },
  { name: 'Sii', sector: 'ESN', city: 'Paris' },
  { name: 'Amiltone', sector: 'ESN', city: 'Lyon' },
  { name: 'Talan', sector: 'Conseil', city: 'Paris' },
  { name: 'Extia', sector: 'ESN', city: 'Paris' },
  { name: 'Meritis', sector: 'ESN', city: 'Paris' },
  { name: 'Onepoint', sector: 'Conseil tech', city: 'Paris' },
  { name: 'Worldline', sector: 'Paiement', city: 'Bezons' },
  { name: 'Keyrus', sector: 'Data / conseil', city: 'Levallois' },
  { name: 'Norsys', sector: 'ESN', city: 'Lille' },
  { name: 'Zenika', sector: 'ESN craft', city: 'Paris' },
  { name: 'SFEIR', sector: 'ESN craft', city: 'Paris' },
  { name: 'Ippon Technologies', sector: 'ESN craft', city: 'Paris' },
  { name: 'Theodo', sector: 'Agence dev', city: 'Paris' },
  { name: 'OCTO Technology', sector: 'Conseil craft', city: 'Paris' },
  { name: 'Publicis Sapient', sector: 'Conseil digital', city: 'Paris' },
  { name: 'Davidson consulting', sector: 'Conseil', city: 'Paris' },
  { name: 'Sopra Banking Software', sector: 'Éditeur bancaire', city: 'Paris' },
  { name: 'Alten', sector: 'Ingénierie', city: 'Boulogne' },
  { name: 'Akka Technologies', sector: 'Ingénierie', city: 'Paris' },
  // Grands comptes / industrie
  { name: 'JCDecaux', sector: 'Communication', city: 'Neuilly-sur-Seine' },
  { name: 'Thales', sector: 'Défense / aéro', city: 'Vélizy' },
  { name: 'Dassault Systèmes', sector: 'Éditeur 3D', city: 'Vélizy' },
  { name: 'Orange', sector: 'Télécom', city: 'Paris' },
  { name: 'SNCF Connect', sector: 'Mobilité', city: 'Paris' },
  { name: 'Airbus', sector: 'Aéronautique', city: 'Toulouse' },
  { name: 'Safran', sector: 'Aéronautique', city: 'Paris' },
  { name: 'BNP Paribas', sector: 'Banque', city: 'Paris' },
  { name: 'Société Générale', sector: 'Banque', city: 'La Défense' },
  { name: 'Crédit Agricole', sector: 'Banque', city: 'Montrouge' },
  { name: 'AXA', sector: 'Assurance', city: 'Paris' },
  { name: 'La Poste', sector: 'Services', city: 'Paris' },
  { name: 'EDF', sector: 'Énergie', city: 'Paris' },
  // Retail / e-commerce
  { name: 'Decathlon', sector: 'Retail sport', city: 'Lille' },
  { name: 'Adeo (Leroy Merlin)', sector: 'Retail', city: 'Lille' },
  { name: 'Boulanger', sector: 'Retail tech', city: 'Lille' },
  { name: 'Kiabi', sector: 'Retail mode', city: 'Lille' },
  { name: 'Cdiscount', sector: 'E-commerce', city: 'Bordeaux' },
  { name: 'ManoMano', sector: 'E-commerce', city: 'Paris' },
  { name: 'Veepee', sector: 'E-commerce', city: 'Saint-Denis' },
  { name: 'Back Market', sector: 'E-commerce reconditionné', city: 'Paris' },
  { name: 'Vestiaire Collective', sector: 'E-commerce mode', city: 'Paris' },
  { name: 'leboncoin', sector: 'Marketplace', city: 'Paris' },
  { name: 'La Redoute', sector: 'E-commerce', city: 'Roubaix' },
  { name: 'Showroomprivé', sector: 'E-commerce', city: 'La Plaine' },
  // Scale-ups / SaaS / fintech
  { name: 'Doctolib', sector: 'Healthtech', city: 'Levallois' },
  { name: 'Qonto', sector: 'Fintech', city: 'Paris' },
  { name: 'Swile', sector: 'Fintech RH', city: 'Paris' },
  { name: 'PayFit', sector: 'SaaS paie', city: 'Paris' },
  { name: 'Pennylane', sector: 'Fintech compta', city: 'Paris' },
  { name: 'Spendesk', sector: 'Fintech', city: 'Paris' },
  { name: 'Alan', sector: 'Assurtech', city: 'Paris' },
  { name: 'Lydia', sector: 'Fintech paiement', city: 'Paris' },
  { name: 'Younited', sector: 'Fintech crédit', city: 'Paris' },
  { name: 'BlaBlaCar', sector: 'Mobilité', city: 'Paris' },
  { name: 'Contentsquare', sector: 'SaaS analytics', city: 'Paris' },
  { name: 'Mirakl', sector: 'SaaS marketplace', city: 'Paris' },
  { name: 'Algolia', sector: 'SaaS search', city: 'Paris' },
  { name: 'Dataiku', sector: 'IA / data', city: 'Paris' },
  { name: 'Malt', sector: 'Marketplace freelance', city: 'Paris' },
  { name: 'Akeneo', sector: 'SaaS PIM', city: 'Nantes' },
  { name: 'Ledger', sector: 'Crypto hardware', city: 'Paris' },
  { name: 'Sorare', sector: 'Gaming web3', city: 'Paris' },
  { name: 'Voodoo', sector: 'Jeux mobiles', city: 'Paris' },
  { name: 'Ubisoft', sector: 'Jeux vidéo', city: 'Montreuil' },
  { name: 'Ankama', sector: 'Jeux vidéo', city: 'Roubaix' },
  { name: 'Deezer', sector: 'Streaming', city: 'Paris' },
  { name: 'Believe', sector: 'Musique digitale', city: 'Paris' },
  { name: 'OpenClassrooms', sector: 'Edtech', city: 'Paris' },
  { name: '360Learning', sector: 'Edtech SaaS', city: 'Paris' },
  { name: 'Yousign', sector: 'SaaS signature', city: 'Caen' },
  { name: 'Lucca', sector: 'SaaS RH', city: 'Paris' },
  { name: 'Aircall', sector: 'SaaS télécom', city: 'Paris' },
  { name: 'OVHcloud', sector: 'Cloud', city: 'Roubaix' },
  { name: 'Shift Technology', sector: 'IA assurance', city: 'Paris' },
  { name: 'Wavestone', sector: 'Conseil', city: 'Paris' },
  { name: 'Ornikar', sector: 'Edtech mobilité', city: 'Paris' }
];

/** Renvoie les entreprises correspondant à la saisie (préfixe prioritaire, puis contient). */
export function searchCompanies(query: string, limit = 8): Company[] {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];
  const starts = COMPANIES.filter(c => c.name.toLowerCase().startsWith(q));
  const contains = COMPANIES.filter(c =>
    !c.name.toLowerCase().startsWith(q) && c.name.toLowerCase().includes(q));
  return [...starts, ...contains].slice(0, limit);
}
