/** Listes de suggestions pour les champs Poste, Lieu et Contrat. */

export const ROLES: string[] = [
  'Développeur Full-stack', 'Développeur Back-end', 'Développeur Front-end',
  'Développeur Java', 'Développeur Java/Angular', 'Développeur Java/Spring Boot',
  'Développeur JavaScript', 'Développeur TypeScript', 'Développeur React',
  'Développeur Angular', 'Développeur Vue.js', 'Développeur Node.js',
  'Développeur Python', 'Développeur .NET / C#', 'Développeur PHP / Symfony',
  'Développeur mobile', 'Développeur web', 'Développeur Cloud',
  'Ingénieur logiciel', 'Ingénieur DevOps', 'Ingénieur études et développement',
  'Data Engineer', 'Concepteur développeur d\'applications',
  'QA / Testeur automaticien', 'Développeur Fullstack Java/React',
  'Développeur Fullstack Node/React', 'Architecte logiciel (junior)'
];

export const CITIES: string[] = [
  'Paris', 'La Défense', 'Neuilly-sur-Seine', 'Levallois-Perret', 'Boulogne-Billancourt',
  'Issy-les-Moulineaux', 'Saint-Denis', 'Ivry-sur-Seine', 'Montreuil', 'Nanterre', 'Bezons',
  'Vélizy', 'Montrouge', 'Lille', 'Roubaix', 'Villeneuve-d\'Ascq', 'Lens',
  'Lyon', 'Villeurbanne', 'Marseille', 'Aix-en-Provence', 'Toulouse', 'Bordeaux',
  'Nantes', 'Rennes', 'Strasbourg', 'Montpellier', 'Nice', 'Sophia Antipolis',
  'Grenoble', 'Rouen', 'Caen', 'Lille (Euratechnologies)', 'Île-de-France',
  'Télétravail', 'Hybride'
];

export const CONTRACTS: string[] = ['Alternance', 'Apprentissage', 'Stage', 'CDI', 'CDD'];

/** Recherche générique : préfixe prioritaire, puis "contient". */
export function searchList(list: string[], query: string, limit = 8): string[] {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];
  const starts = list.filter(x => x.toLowerCase().startsWith(q));
  const contains = list.filter(x => !x.toLowerCase().startsWith(q) && x.toLowerCase().includes(q));
  return [...starts, ...contains].slice(0, limit);
}
