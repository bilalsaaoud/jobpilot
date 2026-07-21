package com.bilalsaaoud.jobpilot.service;

import org.springframework.stereotype.Component;

import java.util.*;

/** Propose un mini-projet concret pour acquérir une compétence manquante. */
@Component
public class ProjectIdeas {

    private static final Map<String, String> IDEAS = new HashMap<>();
    static {
        IDEAS.put("angular", "Recode ton appli de gestion de tâches avec un front Angular + un back Spring Boot : tu couvres Angular en 1 week-end et tu combles le gap le plus demandé.");
        IDEAS.put("kafka", "Ajoute un système de notifications à ton appli de vote : un producteur envoie les votes dans Kafka, un consommateur met à jour les résultats en direct.");
        IDEAS.put("kubernetes", "Déploie ton appli JobPilot sur un cluster local (k3s ou minikube) avec un fichier de déploiement + service : tu montres que tu sais orchestrer des conteneurs.");
        IDEAS.put("aws", "Héberge une de tes API sur AWS (EC2 ou une fonction Lambda + S3) et mets le lien dans ton CV : ça prouve une vraie expérience cloud.");
        IDEAS.put("graphql", "Ajoute une API GraphQL à ton catalogue de produits en plus du REST : le recruteur voit que tu maîtrises les deux styles d'API.");
        IDEAS.put("vue", "Refais l'interface d'un de tes projets en Vue.js : une journée suffit pour avoir un 3ᵉ framework front à ton actif.");
        IDEAS.put("mongodb", "Crée une petite API de blog qui stocke les articles dans MongoDB : tu ajoutes le NoSQL à côté de tes bases SQL.");
        IDEAS.put("redis", "Ajoute un cache Redis devant une de tes API pour accélérer les requêtes répétées : un vrai réflexe de perf apprécié en entretien.");
        IDEAS.put("microservices", "Découpe une appli en 2-3 services Spring Boot + une passerelle (API Gateway) : c'est LE projet qui impressionne le plus techniquement.");
        IDEAS.put("azure", "Déploie une API .NET sur Azure App Service : logique vu ta base ASP.NET Core.");
        IDEAS.put("gcp", "Héberge un conteneur Docker sur Google Cloud Run : déploiement cloud en quelques minutes, lien à mettre au CV.");
        IDEAS.put("terraform", "Écris un script Terraform qui crée l'infra d'un de tes projets : tu ajoutes l'Infrastructure-as-Code, très recherché.");
        IDEAS.put("php", "Recode un mini-CRUD en Symfony ou Laravel : un projet PHP suffit à cocher la case sur les offres qui le demandent.");
        IDEAS.put("cucumber", "Ajoute des tests Cucumber (scénarios en langage naturel) sur ton projet Spring Boot : tu montres les tests d'acceptation, souvent demandés.");
        IDEAS.put("jenkins", "Mets en place un pipeline Jenkins pour un de tes repos : tu complètes ta maîtrise CI/CD au-delà de GitHub Actions.");
        IDEAS.put("sonar", "Branche SonarQube (ou SonarCloud) sur un projet et corrige les alertes : la qualité de code est un vrai argument.");
        IDEAS.put("rabbitmq", "Fais communiquer deux petits services via RabbitMQ : même principe que Kafka, plus simple à démarrer.");
        IDEAS.put("elasticsearch", "Ajoute une recherche full-text avec Elasticsearch à ton catalogue : recherche instantanée, effet garanti en démo.");
    }

    /** Retourne des idées pour les compétences manquantes (au plus {limit}). */
    public List<Map<String, String>> forMissing(List<String> missing, int limit) {
        List<Map<String, String>> out = new ArrayList<>();
        for (String skill : missing) {
            String idea = IDEAS.getOrDefault(skill,
                "Mets en avant " + skill + " : suis une courte formation (en ligne, gratuite) ou "
                + "cite une expérience/un projet où tu l'as utilisé — même à petite échelle, ça compte.");
            out.add(Map.of("skill", skill, "idea", idea));
            if (out.size() >= limit) break;
        }
        return out;
    }
}
