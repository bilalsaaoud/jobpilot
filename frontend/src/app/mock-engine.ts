import { AnalysisResult, AnalyzeRequest, JobApplication } from './models';

/** Profil du candidat (miroir de profile.json cote back). */
const PROFILE = {
  fullName: 'Bilal Saaoud',
  school: "ETNA (groupe IONIS)",
  diploma: 'Bachelor Développeur Full-stack',
  availability: 'octobre 2026',
  location: 'Île-de-France',
  portfolio: 'bilalsaaoud.github.io',
  email: 'bilal123saaoud@gmail.com',
  phone: '+33 7 69 40 89 43',
  rhythm: 'Rythme ETNA : présent en entreprise ~96 % du temps (un vendredi école toutes les 3 semaines).',
  skills: ['java','spring boot','jpa','hibernate','rest','junit','javascript','typescript','react',
    'node.js','express','python','asp.net core','.net','html','css','tailwind','sql','postgresql',
    'mysql','sql server','docker','git','github actions','ci/cd','linux','agile','scrum',
    'design patterns','maven'],
  learning: ['angular','kafka','kubernetes','aws']
};

const DICT: Record<string, string[]> = {
  'java':['java','jdk'],'spring boot':['spring boot','springboot'],'spring':['spring framework','spring mvc'],
  'jpa':['jpa'],'hibernate':['hibernate'],'rest':['rest','restful','api rest'],'junit':['junit'],
  'cucumber':['cucumber'],'kafka':['kafka'],'rabbitmq':['rabbitmq'],'maven':['maven'],'gradle':['gradle'],
  'jenkins':['jenkins'],'sonar':['sonar'],'javascript':['javascript',' js '],'typescript':['typescript'],
  'react':['react'],'angular':['angular'],'vue':['vue'],'node.js':['node.js','nodejs','node js'],
  'express':['express'],'python':['python','django','flask'],'php':['php','symfony','laravel'],
  'asp.net core':['asp.net','.net core','.net 8','dotnet'],'c#':['c#','csharp'],'html':['html'],
  'css':['css','sass','scss'],'tailwind':['tailwind'],'sql':[' sql '],'postgresql':['postgresql','postgres'],
  'mysql':['mysql','mariadb'],'sql server':['sql server','t-sql'],'mongodb':['mongodb','mongo'],
  'redis':['redis'],'elasticsearch':['elasticsearch'],'docker':['docker','conteneur','container'],
  'kubernetes':['kubernetes','k8s'],'aws':['aws','amazon web services'],'azure':['azure'],
  'gcp':['gcp','google cloud'],'terraform':['terraform'],'git':[' git ','gitlab','github'],
  'github actions':['github actions'],'gitlab ci':['gitlab ci'],'ci/cd':['ci/cd','intégration continue'],
  'linux':['linux','unix','bash'],'agile':['agile','scrum','kanban'],'scrum':['scrum'],
  'design patterns':['design pattern'],'microservices':['microservice'],'graphql':['graphql'],
  'jira':['jira'],'confluence':['confluence'],'intellij':['intellij']
};

function extract(text: string): string[] {
  const t = ' ' + (text || '').toLowerCase().replace(/\n/g, ' ') + ' ';
  const found: string[] = [];
  for (const [canon, variants] of Object.entries(DICT)) {
    if (variants.some(v => t.includes(v))) found.push(canon);
  }
  return found;
}

function verdict(score: number): string {
  if (score >= 80) return 'Excellent match — postule en priorité';
  if (score >= 60) return 'Bon match — candidature pertinente';
  if (score >= 40) return 'Match partiel — mets en avant tes atouts transférables';
  return "Match faible — à tenter seulement si l'offre te motive vraiment";
}


const KNOWN_COMPANIES = ['JCDecaux','Sopra Steria','Capgemini','Doctolib','Dassault','Thales','Orange',
  'Atos','Inetum','Devoteam','CGI','Sii','Amiltone','Talan','Extia','Meritis','Onepoint','Worldline',
  'OVHcloud','Decathlon','Adeo','Leroy Merlin','Boulanger','Kiabi','Norsys','Zenika','SFEIR','Ippon',
  'Theodo','OCTO','Publicis Sapient','Qonto','Swile','BlaBlaCar','Back Market','Alan','PayFit','Pennylane',
  'Contentsquare','Mirakl','Algolia','Malt','ManoMano','Dataiku','Ledger','Believe','Veepee','Cdiscount',
  'Akeneo','Younited','Sorare','Voodoo','Ubisoft','Ankama','Keyrus'];
const CITIES = ['Neuilly-sur-Seine','Levallois-Perret','Levallois','Boulogne-Billancourt',
  'Issy-les-Moulineaux','Saint-Denis','Ivry-sur-Seine','Montreuil','Nanterre','La Défense','Paris','Lyon',
  'Villeurbanne','Lille','Roubaix','Marseille','Toulouse','Bordeaux','Nantes','Rennes','Strasbourg',
  'Montpellier','Nice','Sophia Antipolis','Grenoble','Rouen','Lens','Île-de-France','Ile-de-France'];

const IDEAS: Record<string,string> = {
  'angular': "Recode ton appli de gestion de tâches avec un front Angular + un back Spring Boot : tu combles le gap le plus demandé en un week-end.",
  'kafka': "Ajoute un système de notifications à ton appli de vote : un producteur envoie les votes dans Kafka, un consommateur met à jour les résultats en direct.",
  'kubernetes': "Déploie JobPilot sur un cluster local (k3s ou minikube) : tu montres que tu sais orchestrer des conteneurs.",
  'aws': "Héberge une de tes API sur AWS (EC2 ou Lambda + S3) et mets le lien au CV : une vraie expérience cloud.",
  'graphql': "Ajoute une API GraphQL à ton catalogue en plus du REST : tu maîtrises les deux styles d'API.",
  'vue': "Refais l'interface d'un projet en Vue.js : un 3ᵉ framework front à ton actif en une journée.",
  'mongodb': "Crée une petite API de blog stockée dans MongoDB : le NoSQL à côté de tes bases SQL.",
  'redis': "Ajoute un cache Redis devant une API : un vrai réflexe de perf apprécié en entretien.",
  'microservices': "Découpe une appli en 2-3 services Spring Boot + une passerelle : LE projet qui impressionne le plus.",
  'azure': "Déploie une API .NET sur Azure App Service : logique vu ta base ASP.NET Core.",
  'gcp': "Héberge un conteneur sur Google Cloud Run : déploiement cloud en quelques minutes.",
  'terraform': "Écris un script Terraform pour l'infra d'un projet : l'Infrastructure-as-Code, très recherché.",
  'php': "Recode un mini-CRUD en Symfony ou Laravel : un projet PHP coche la case.",
  'cucumber': "Ajoute des tests Cucumber sur ton projet Spring Boot : les tests d'acceptation, souvent demandés.",
  'jenkins': "Mets en place un pipeline Jenkins : tu complètes ta maîtrise CI/CD.",
  'sonar': "Branche SonarQube sur un projet et corrige les alertes : la qualité de code est un argument.",
  'rabbitmq': "Fais communiquer deux services via RabbitMQ : même principe que Kafka, plus simple.",
  'elasticsearch': "Ajoute une recherche full-text avec Elasticsearch : effet garanti en démo."
};

export interface Detected { company?: string; role?: string; location?: string; contract?: string; }

export function mockParse(text: string): Detected {
  const d: Detected = {};
  if (!text) return d;
  const low = text.toLowerCase();
  if (low.includes('altern') || low.includes('apprentiss')) d.contract = 'Alternance';
  else if (low.includes('stage') || low.includes('intern')) d.contract = 'Stage';
  else if (low.includes('cdi')) d.contract = 'CDI';
  else if (low.includes('cdd')) d.contract = 'CDD';
  for (const c of CITIES) { if (low.includes(c.toLowerCase())) { d.location = c; break; } }
  for (const c of KNOWN_COMPANIES) { if (low.includes(c.toLowerCase())) { d.company = c; break; } }
  if (!d.company) {
    const m = text.match(/(?:chez|rejoindre|rejoignez|int[ée]grer|au sein de(?: la DSI de)?)\s+([A-Z][\wéèà&.'-]+(?:\s+[A-Z][\wéèà&.'-]+)?)/);
    if (m) d.company = m[1].trim();
  }
  const r = text.match(/((?:D[ée]veloppeur|Ing[ée]nieur|D[ée]veloppeuse|Concepteur|DevOps|Full[- ]?stack|Back[- ]?end|Front[- ]?end)(?:[\wéèà0-9 ./&'+-]{0,40})?)/i);
  if (r) {
    let role = r[1].trim().split(/\b(au sein|pour|dans|chez|,|\.|H\/F|F\/H)\b/i)[0].trim();
    if (role.length > 3) d.role = role;
  }
  return d;
}

function ideasFor(missing: string[], limit: number): { skill: string; idea: string }[] {
  return missing.slice(0, limit).map(skill => ({
    skill,
    idea: IDEAS[skill] ?? `Ajoute ${skill} à un de tes projets existants et documente-le dans le README : même une petite intégration compte.`
  }));
}

export function mockAnalyze(req: AnalyzeRequest): AnalysisResult {
  const det = mockParse(req.offerText);
  const company0 = req.company?.trim() || det.company;
  const role0 = req.role?.trim() || det.role;
  const offer = extract(req.offerText);
  const mine = new Set(PROFILE.skills);
  const learning = new Set(PROFILE.learning);
  const matched: string[] = [], missing: string[] = [];
  let weighted = 0;
  for (const s of offer) {
    if (mine.has(s)) { matched.push(s); weighted += 1; }
    else if (learning.has(s)) { missing.push(s); weighted += 0.4; }
    else missing.push(s);
  }
  const score = offer.length === 0 ? 50
    : Math.max(0, Math.min(100, Math.round(100 * weighted / offer.length)));

  const company = company0 || 'votre entreprise';
  const role = role0 || 'le poste proposé';
  const top = matched.slice(0, 5).join(', ') || 'Java, Spring Boot, React';
  let cover = `Madame, Monsieur,\n\n`
    + `Étudiant en ${PROFILE.diploma} à l'${PROFILE.school}, je recherche une alternance à partir de `
    + `${PROFILE.availability} et votre offre de ${role} chez ${company} correspond précisément au poste que je souhaite occuper.\n\n`
    + `Je développe et teste des applications autour de ${top}, au sein d'équipes Agile et de pipelines CI/CD. `
    + `Vous trouverez mes projets et leur code sur mon portfolio : ${PROFILE.portfolio}.\n\n`;
  if (missing.length) {
    cover += `Votre environnement mobilise également ${missing.slice(0,2).join(' et ')} : des technologies que je suis motivé à approfondir rapidement.\n\n`;
  }
  cover += `${PROFILE.rhythm} Basé en ${PROFILE.location} et mobile, je serais ravi d'échanger sur votre besoin.\n\n`
    + `Bien cordialement,\n${PROFILE.fullName}\n${PROFILE.email} · ${PROFILE.phone}`;

  let cv = `Score de compatibilité : ${score}/100.\n\n`;
  if (matched.length) cv += `À METTRE EN AVANT :\n` + matched.map(k => '  • ' + k).join('\n') + '\n\n';
  if (missing.length) cv += `À AJOUTER OU TRAVAILLER :\n` + missing.map(k => '  • ' + k + " — mentionne un projet ou lance un mini-projet.").join('\n');
  else cv += 'Aucune compétence manquante majeure : profil parfaitement aligné.';

  return { matchScore: score, verdict: verdict(score), matchedKeywords: matched,
    missingKeywords: missing, coverLetter: cover, cvSuggestions: cv, engine: 'keyword (démo)',
    detectedCompany: det.company, detectedRole: det.role, detectedLocation: det.location,
    detectedContract: det.contract, projectIdeas: ideasFor(missing, 4) };
}

/** Jeu de candidatures de demonstration (mode hors-ligne). */
export function mockApplications(): JobApplication[] {
  const make = (id: number, company: string, role: string, loc: string,
                offer: string, status: any, followUp?: string): JobApplication => {
    const a = mockAnalyze({ offerText: offer, company, role });
    return { id, company, role, location: loc, contractType: 'Alternance', offerText: offer,
      status, matchScore: a.matchScore, matchedKeywords: a.matchedKeywords,
      missingKeywords: a.missingKeywords, coverLetter: a.coverLetter, cvSuggestions: a.cvSuggestions,
      followUpDate: followUp, createdAt: new Date().toISOString() };
  };
  return [
    make(1,'JCDecaux','Alternance Développeur Java/Angular','Neuilly-sur-Seine',
      'Java 17 et 21, Spring Boot 3, JPA Hibernate, PostgreSQL, Kafka, REST, JUnit, Cucumber. Maven, Jenkins, Sonar, Docker, Kubernetes, AWS. Angular 19. Agile, Jira, Confluence.','ENVOYEE',
      new Date(Date.now()+5*864e5).toISOString().slice(0,10)),
    make(2,'Sopra Steria','Alternance Développeur Java','Lyon',
      'Java Spring Boot, ASP.NET Core, JUnit, Docker, GitLab CI, PostgreSQL, Agile Scrum, anglais B2.','ENTRETIEN'),
    make(3,'Doctolib','Alternance Développeur Full-stack','Levallois',
      'React, TypeScript, Node.js, Ruby on Rails, PostgreSQL, Docker, CI/CD, Agile.','A_ENVOYER')
  ];
}
