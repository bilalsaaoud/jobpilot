import { DOMAINS, extractDomainSkills } from './domains';

const PDF_VERSION = '3.11.174';
const PDF_JS = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDF_VERSION}/pdf.min.js`;
const PDF_WORKER = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDF_VERSION}/pdf.worker.min.js`;

let pdfLoading: Promise<any> | null = null;

/** Charge pdf.js depuis un CDN une seule fois (pas de dépendance npm). */
function loadPdfJs(): Promise<any> {
  const w = window as any;
  if (w.pdfjsLib) return Promise.resolve(w.pdfjsLib);
  if (pdfLoading) return pdfLoading;
  pdfLoading = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = PDF_JS;
    s.onload = () => {
      const lib = (window as any).pdfjsLib;
      if (lib) { lib.GlobalWorkerOptions.workerSrc = PDF_WORKER; resolve(lib); }
      else reject(new Error('pdf.js introuvable'));
    };
    s.onerror = () => reject(new Error('Chargement pdf.js échoué'));
    document.head.appendChild(s);
  });
  return pdfLoading;
}

/** Extrait le texte d'un fichier PDF ou texte. */
export async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    const pdfjs = await loadPdfJs();
    const buf = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: buf }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += ' ' + content.items.map((it: any) => it.str).join(' ');
    }
    return text;
  }
  // txt / autres : lecture directe
  return file.text();
}

export interface CvResult { domain: string; skills: string[]; total: number; }

/** Détecte le domaine le plus probable et les compétences présentes dans le texte du CV. */
export function detectSkillsFromText(text: string): CvResult {
  let best: CvResult = { domain: 'informatique', skills: [], total: 0 };
  for (const d of DOMAINS) {
    const skills = extractDomainSkills(d.id, text).map(s => s.toLowerCase());
    if (skills.length > best.skills.length) best = { domain: d.id, skills, total: skills.length };
  }
  return best;
}

import { getDomain } from './domains';
import { ideasFor } from './mock-engine';

export interface CvInsights {
  domainLabel: string;
  strengths: string[];
  gaps: string[];
  ideas: { skill: string; idea: string }[];
  verdict: string;
  coverage: number;
}

/** Donne un avis sur le CV (sans offre) : forces, compétences clés du métier à renforcer, projets à ajouter. */
export function cvInsights(domain: string, userSkills: string[]): CvInsights {
  const dom = getDomain(domain);
  const have = new Set(userSkills.map(s => s.toLowerCase()));
  const gaps = dom.skills.map(s => s.toLowerCase()).filter(s => !have.has(s)).slice(0, 8);
  const coverage = dom.skills.length ? Math.round(100 * (dom.skills.length - gaps.length) / dom.skills.length) : 0;
  let verdict: string;
  if (userSkills.length >= 12) verdict = 'Profil riche et bien fourni — beau CV !';
  else if (userSkills.length >= 7) verdict = 'Bon profil — quelques ajouts le rendraient encore plus solide.';
  else verdict = 'Profil à étoffer — ajoute des compétences et des projets ciblés.';
  return {
    domainLabel: dom.label,
    strengths: userSkills.slice(0, 12),
    gaps,
    ideas: ideasFor(gaps, 4),
    verdict,
    coverage
  };
}
