package com.bilalsaaoud.jobpilot.service.ai;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/** Genere le mot de motivation et les conseils CV par templates. Toujours disponible. */
@Component
public class KeywordAiClient implements AiClient {

    @Override
    public GenerationResult generate(GenerationContext c) {
        return new GenerationResult(coverLetter(c), cvSuggestions(c), name());
    }

    private String coverLetter(GenerationContext c) {
        String company = orDefault(c.company, "votre entreprise");
        String role = orDefault(c.role, "le poste proposé");
        String topSkills = c.matched.stream().limit(5).collect(Collectors.joining(", "));
        if (topSkills.isBlank()) topSkills = "Java, Spring Boot, React";
        var p = c.profile;

        StringBuilder sb = new StringBuilder();
        sb.append("Madame, Monsieur,\n\n");
        sb.append("Étudiant en ").append(p.getDiploma()).append(" à l'").append(p.getSchool())
          .append(", je recherche une alternance à partir de ").append(p.getAvailability())
          .append(" et votre offre de ").append(role).append(" chez ").append(company)
          .append(" correspond précisément au poste que je souhaite occuper.\n\n");
        sb.append("Je développe et teste des applications autour de ").append(topSkills)
          .append(", au sein d'équipes Agile et de pipelines CI/CD. Vous trouverez mes projets et leur code sur mon portfolio : ")
          .append(p.getPortfolio()).append(".\n\n");
        if (!c.missing.isEmpty()) {
            String toLearn = c.missing.stream().limit(2).collect(Collectors.joining(" et "));
            sb.append("Votre environnement mobilise également ").append(toLearn)
              .append(" : des technologies que je suis motivé à approfondir rapidement, ma base full-stack me permettant de monter vite en compétence.\n\n");
        }
        sb.append(p.getRhythmPitch())
          .append(" Basé en ").append(p.getLocation())
          .append(" et mobile, je serais ravi d'échanger sur votre besoin.\n\n");
        sb.append("Je vous remercie de l'attention portée à ma candidature et reste à votre disposition pour un entretien.\n\n");
        sb.append("Bien cordialement,\n").append(p.getFullName())
          .append("\n").append(p.getEmail()).append(" · ").append(p.getPhone());
        return sb.toString();
    }

    private String cvSuggestions(GenerationContext c) {
        StringBuilder sb = new StringBuilder();
        sb.append("Score de compatibilité : ").append(c.matchScore).append("/100.\n\n");
        if (!c.matched.isEmpty()) {
            sb.append("À METTRE EN AVANT (déjà dans ton profil, cité dans l'offre) :\n");
            for (String k : c.matched) sb.append("  • ").append(k).append("\n");
            sb.append("\n");
        }
        if (!c.missing.isEmpty()) {
            sb.append("À AJOUTER OU TRAVAILLER (demandé par l'offre, absent de ton profil) :\n");
            for (String k : c.missing) {
                sb.append("  • ").append(k)
                  .append(" — mentionne un projet ou une notion, ou lance un mini-projet pour le couvrir.\n");
            }
        } else {
            sb.append("Aucune compétence manquante majeure : profil parfaitement aligné.\n");
        }
        return sb.toString();
    }

    private String orDefault(String v, String d) { return (v == null || v.isBlank()) ? d : v; }

    @Override public String name() { return "keyword"; }
}
