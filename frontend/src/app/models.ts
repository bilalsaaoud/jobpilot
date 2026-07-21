export type ApplicationStatus =
  'A_ENVOYER' | 'ENVOYEE' | 'RELANCEE' | 'ENTRETIEN' | 'OFFRE' | 'REFUSEE';

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  A_ENVOYER: 'À envoyer',
  ENVOYEE: 'Envoyée',
  RELANCEE: 'Relancée',
  ENTRETIEN: 'Entretien',
  OFFRE: 'Offre reçue',
  REFUSEE: 'Refusée'
};

export interface AnalyzeRequest {
  offerText: string;
  company?: string;
  role?: string;
  location?: string;
  contractType?: string;
  sourceUrl?: string;
  save?: boolean;
  domain?: string;
  userSkills?: string[];
}

export interface AnalysisResult {
  id?: number;
  matchScore: number;
  verdict: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  coverLetter: string;
  cvSuggestions: string;
  engine: string;
  detectedCompany?: string;
  detectedRole?: string;
  detectedLocation?: string;
  detectedContract?: string;
  projectIdeas: { skill: string; idea: string }[];
}

export interface JobApplication {
  id: number;
  company?: string;
  role?: string;
  location?: string;
  contractType?: string;
  sourceUrl?: string;
  offerText?: string;
  status: ApplicationStatus;
  matchScore?: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  coverLetter?: string;
  cvSuggestions?: string;
  followUpDate?: string;
  notes?: string;
  createdAt?: string;
}

export interface Stats {
  total: number;
  averageScore: number;
  interviews: number;
  offers: number;
  byStatus: Record<string, number>;
}
