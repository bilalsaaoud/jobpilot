package com.bilalsaaoud.jobpilot.model;

/** Cycle de vie d'une candidature. */
public enum ApplicationStatus {
    A_ENVOYER("A envoyer"),
    ENVOYEE("Envoyee"),
    RELANCEE("Relancee"),
    ENTRETIEN("Entretien"),
    OFFRE("Offre recue"),
    REFUSEE("Refusee");

    private final String label;
    ApplicationStatus(String label) { this.label = label; }
    public String getLabel() { return label; }
}
