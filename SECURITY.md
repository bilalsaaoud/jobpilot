# Sécurité — JobPilot

La sécurité a été pensée dès la conception, en s'appuyant sur les recommandations **OWASP**. Voici les mesures en place.

## Validation des entrées (anti-abus / anti-DoS)

Toutes les données reçues par l'API sont validées côté serveur (`jakarta.validation`) :

- le texte d'une offre est limité à **20 000 caractères** (empêche les payloads géants) ;
- les champs entreprise, poste, lieu, contrat et lien sont bornés en longueur ;
- la liste « Mes compétences » est plafonnée (**60 éléments max**, chacun ≤ 60 caractères) ;
- les notes de suivi sont limitées à 3 000 caractères.

Une entrée invalide renvoie un **400 Bad Request** propre, sans détail technique interne.

## Limitation de débit (rate limiting)

Un filtre limite chaque adresse IP à **90 requêtes/minute** sur `/api/**` (fenêtre glissante).
Au-delà, l'API renvoie un **429 Too Many Requests**. Cela protège contre l'abus automatisé
et le déni de service applicatif. La logique (`RateLimiter`) est isolée et couverte par des tests.

## En-têtes de sécurité HTTP

Ajoutés à chaque réponse (API via un filtre, front via nginx) :

| En-tête | Rôle |
|---|---|
| `X-Content-Type-Options: nosniff` | empêche le navigateur de "deviner" le type MIME |
| `X-Frame-Options: DENY` | empêche l'intégration en iframe (anti-**clickjacking**) |
| `Content-Security-Policy` | restreint les sources autorisées (anti-**XSS** / injection) |
| `Referrer-Policy` | limite la fuite d'URL de provenance |
| `Permissions-Policy` | désactive caméra, micro, géolocalisation |

`server_tokens off` / `server.error.include-stacktrace: never` masquent la version du serveur et les traces d'erreur.

## Protections structurelles

- **Injection SQL** : toutes les requêtes passent par Spring Data JPA (requêtes **paramétrées**) — jamais de concaténation SQL.
- **XSS** : le front Angular échappe automatiquement toutes les interpolations ; aucun rendu HTML brut (`innerHTML`) n'est utilisé.
- **CORS** : seules les origines explicitement autorisées (configurables par variable d'environnement) peuvent appeler l'API.
- **Secrets** : aucune clé n'est en dur dans le code. La clé du LLM se fournit uniquement par variable d'environnement (`OPENAI_API_KEY`).
- **Surface réduite** : pas d'endpoint d'administration (Actuator) exposé.

## Pistes d'évolution

Si JobPilot évoluait vers des comptes utilisateurs, l'étape suivante serait
**Spring Security + JWT** (authentification/autorisation) et un stockage chiffré des données personnelles.

## Signaler une vulnérabilité

Contact : bilal123saaoud@gmail.com
