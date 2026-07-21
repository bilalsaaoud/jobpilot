package com.bilalsaaoud.jobpilot.service;

import org.springframework.stereotype.Component;

import java.util.*;

/**
 * Dictionnaire de technologies. Chaque entree = un mot-cle canonique + ses alias/variantes.
 * Sert a extraire de facon fiable les technos citees dans une offre, meme avec des ecritures differentes.
 */
@Component
public class TechDictionary {

    /** canonical -> variantes recherchees (en minuscule). */
    private static final Map<String, List<String>> TERMS = new LinkedHashMap<>();
    static {
        put("java", "java", "java 8", "java 11", "java 17", "java 21", "jdk");
        put("spring boot", "spring boot", "springboot", "spring-boot");
        put("spring", "spring framework", "spring mvc", "spring security", "spring cloud");
        put("jpa", "jpa", "java persistence");
        put("hibernate", "hibernate");
        put("rest", "rest", "api rest", "restful", "rest api");
        put("junit", "junit");
        put("cucumber", "cucumber");
        put("kafka", "kafka", "apache kafka");
        put("rabbitmq", "rabbitmq");
        put("maven", "maven");
        put("gradle", "gradle");
        put("jenkins", "jenkins");
        put("sonar", "sonar", "sonarqube");
        put("javascript", "javascript", " js ", "js,");
        put("typescript", "typescript");
        put("react", "react", "react.js", "reactjs");
        put("angular", "angular", "angular.js", "angularjs");
        put("vue", "vue", "vue.js", "vuejs");
        put("node.js", "node.js", "nodejs", "node js");
        put("express", "express", "express.js");
        put("python", "python", "django", "flask");
        put("php", " php ", "symfony", "laravel");
        put("asp.net core", "asp.net core", "asp.net", ".net core", ".net 8", "dotnet");
        put("c#", "c#", "csharp");
        put("html", "html", "html5");
        put("css", "css", "css3", "sass", "scss");
        put("tailwind", "tailwind");
        put("sql", " sql ", "sql,");
        put("postgresql", "postgresql", "postgres");
        put("mysql", "mysql", "mariadb");
        put("sql server", "sql server", "sqlserver", "t-sql");
        put("oracle", "oracle db", "pl/sql");
        put("mongodb", "mongodb", "mongo");
        put("redis", "redis");
        put("elasticsearch", "elasticsearch", "elastic search");
        put("docker", "docker", "conteneur", "container");
        put("kubernetes", "kubernetes", "k8s");
        put("aws", "aws", "amazon web services");
        put("azure", "azure");
        put("gcp", "gcp", "google cloud");
        put("terraform", "terraform");
        put("git", " git ", "git,", "gitlab", "github");
        put("github actions", "github actions");
        put("gitlab ci", "gitlab ci", "gitlab-ci");
        put("ci/cd", "ci/cd", "ci / cd", "integration continue", "intégration continue");
        put("linux", "linux", "unix", "bash");
        put("agile", "agile", "scrum", "kanban", "safe");
        put("scrum", "scrum");
        put("design patterns", "design pattern", "patrons de conception");
        put("microservices", "microservice", "micro-service");
        put("graphql", "graphql");
        put("jira", "jira");
        put("confluence", "confluence");
        put("intellij", "intellij");
    }

    private static void put(String canonical, String... variants) {
        TERMS.put(canonical, Arrays.asList(variants));
    }

    /** Retourne l'ensemble ordonne des technos detectees dans le texte. */
    public Set<String> extract(String text) {
        if (text == null || text.isBlank()) return Set.of();
        String t = " " + text.toLowerCase().replace("\n", " ") + " ";
        Set<String> found = new LinkedHashSet<>();
        for (Map.Entry<String, List<String>> e : TERMS.entrySet()) {
            for (String v : e.getValue()) {
                if (t.contains(v)) { found.add(e.getKey()); break; }
            }
        }
        return found;
    }

    public Set<String> allCanonical() { return TERMS.keySet(); }
}
