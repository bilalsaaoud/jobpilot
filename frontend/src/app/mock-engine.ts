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

export function mockAnalyze(req: AnalyzeRequest): AnalysisResult {
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

  const company = req.company?.trim() || 'votre entreprise';
  const role = req.role?.trim() || 'le poste proposé';
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
    missingKeywords: missing, coverLetter: cover, cvSuggestions: cv, engine: 'keyword (démo)' };
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
