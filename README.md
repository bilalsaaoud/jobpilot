# ✈ JobPilot — Assistant intelligent de recherche d'alternance

> Colle une offre d'emploi → JobPilot calcule ta **compatibilité**, repère les **compétences manquantes**, génère ton **mot de motivation** et **suit tes candidatures**.

![CI](https://github.com/bilalsaaoud/jobpilot/actions/workflows/ci.yml/badge.svg)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-brightgreen)
![Angular](https://img.shields.io/badge/Angular-18-red)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)

**Démo en ligne (sans installation) :** https://bilalsaaoud.github.io/jobpilot/

---

## Pourquoi ce projet

Pendant ma recherche d'alternance, j'adaptais chaque CV et chaque mot de motivation à la main, et je suivais mes candidatures dans un tableur. J'en ai fait une application complète : **full-stack Java / Angular, dockerisée, testée et déployée en CI/CD**, avec une couche d'**IA** pour l'analyse et la génération de texte.

C'est un outil que j'utilise réellement — pas une démo jetable.

---

## Fonctionnalités

- **Multi-domaines** : 10 métiers couverts (dév, marketing, commerce, finance, RH, design, data, ingénierie, logistique, juridique). Chaque domaine a son propre vocabulaire de compétences et ses intitulés de poste.
- **Compétences personnalisables** : l'utilisateur ajuste « Mes compétences » (avec autocomplétion) pour un score adapté à son profil.
- **Autocomplétion** sur Entreprise (82 boîtes qui recrutent des alternants), Poste et Lieu, avec navigation clavier.
- **Détection automatique** de l'entreprise, du poste, du lieu et du type de contrat à partir du texte de l'offre.
- **Analyse d'offre** : extraction automatique des compétences citées, comparaison avec le profil, **score de compatibilité 0-100** et verdict.
- **Génération de contenu** : mot de motivation et conseils d'adaptation du CV, personnalisés à l'offre.
- **Moteur IA branchable** : utilise un **LLM** (compatible OpenAI) si une clé API est fournie, sinon bascule automatiquement sur un moteur d'analyse par mots-clés — l'application marche toujours, sans clé.
- **Suivi des candidatures** : statuts (à envoyer → envoyée → relancée → entretien → offre / refusée), dates de relance, notes.
- **Tableau de bord** : nombre de candidatures, score moyen, entretiens, offres, répartition par statut.
- **Mode démo hors-ligne** : sur GitHub Pages (sans backend), l'analyse tourne côté navigateur — le recruteur peut tester immédiatement.

---

## Architecture

```
┌──────────────┐     REST/JSON      ┌────────────────────┐     JPA      ┌────────────┐
│  Angular 18  │  ───────────────▶  │  Spring Boot 3     │  ─────────▶  │ PostgreSQL │
│  (dashboard) │  ◀───────────────  │  API + moteur IA   │  ◀─────────  │            │
└──────────────┘                    └─────────┬──────────┘              └────────────┘
      nginx                                    │ (optionnel)
                                               ▼
                                        ┌──────────────┐
                                        │  LLM (OpenAI)│
                                        └──────────────┘
```

Le tout orchestré par **Docker Compose** ; build et tests automatisés par **GitHub Actions**.

---

## Stack technique

| Couche | Technologies |
|---|---|
| **Back-end** | Java 17, Spring Boot 3 (Web, Data JPA, Validation), Hibernate, springdoc/OpenAPI |
| **Base de données** | PostgreSQL (prod), H2 (tests/CI) |
| **IA** | Client LLM compatible OpenAI + moteur de secours par mots-clés |
| **Front-end** | Angular 18 (standalone components, signals), TypeScript, RxJS |
| **Tests** | JUnit 5, AssertJ, Spring Boot Test |
| **DevOps** | Docker, Docker Compose, Nginx, GitHub Actions (CI + déploiement Pages) |

---

## Démarrage rapide

### Option 1 — Docker (tout en une commande)

```bash
docker compose up --build
```

- Front : http://localhost:8081
- API + Swagger : http://localhost:8080/swagger-ui.html

### Option 2 — En local (dev)

**Back-end**
```bash
cd backend
./mvnw spring-boot:run        # démarre sur :8080 avec une base H2 en mémoire
```

**Front-end**
```bash
cd frontend
npm install
npm start                     # démarre sur :4200, proxy /api -> :8080
```

### Activer la génération par LLM (optionnel)

```bash
export OPENAI_API_KEY="sk-..."
```
Sans cette variable, JobPilot utilise le moteur par mots-clés (aucune clé requise).

---

## API (extrait)

| Méthode | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analyze` | Analyse une offre (option `save=true` pour l'enregistrer) |
| `GET` | `/api/applications` | Liste les candidatures (triées par score) |
| `PATCH` | `/api/applications/{id}` | Met à jour statut / relance / notes |
| `DELETE` | `/api/applications/{id}` | Supprime une candidature |
| `GET` | `/api/applications/follow-up` | Candidatures à relancer aujourd'hui |
| `GET` | `/api/applications/stats` | Statistiques du tableau de bord |
| `GET` | `/api/profile` | Profil du candidat utilisé pour l'analyse |

Documentation interactive complète : `/swagger-ui.html`.

---

## Sécurité

Souvent oubliée dans les projets étudiants, la sécurité est ici intégrée dès la conception (approche OWASP) : validation stricte des entrées, **rate limiting** par IP (429), **en-têtes de sécurité HTTP** (anti-clickjacking, anti-XSS, anti-MIME-sniffing), requêtes SQL paramétrées (anti-injection), CORS restreint et aucun secret en dur. Détails dans [SECURITY.md](SECURITY.md).

## Tests

```bash
cd backend && ./mvnw verify
```

Couvre l'extraction de technologies, le calcul du score, la génération du mot de motivation et le chargement du contexte Spring.

---

## Structure

```
jobpilot/
├── backend/            # API Spring Boot (Java 17)
│   └── src/main/java/com/bilalsaaoud/jobpilot/
│       ├── model/          # entités JPA + statuts
│       ├── repository/     # Spring Data
│       ├── service/        # analyse, dictionnaire techno, moteurs IA
│       ├── controller/     # endpoints REST
│       └── config/         # profil candidat, CORS, OpenAPI, seed
├── frontend/           # Angular 18 (dashboard)
│   └── src/app/
│       ├── components/     # analyzer, applications, stats
│       ├── job.service.ts  # API + fallback hors-ligne
│       └── mock-engine.ts  # moteur d'analyse côté client (mode démo)
├── docker-compose.yml
└── .github/workflows/  # CI + déploiement GitHub Pages
```

---

## Auteur

**Bilal Saaoud** — Bachelor Développeur Full-stack @ ETNA (groupe IONIS), en recherche d'alternance (oct. 2026).
[Portfolio](https://bilalsaaoud.github.io) · [GitHub](https://github.com/bilalsaaoud) · bilal123saaoud@gmail.com
