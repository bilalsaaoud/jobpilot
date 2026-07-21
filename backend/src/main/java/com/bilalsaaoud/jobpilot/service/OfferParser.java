package com.bilalsaaoud.jobpilot.service;

import org.springframework.stereotype.Component;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Extrait automatiquement les infos clés d'une offre (entreprise, poste, lieu, contrat). */
@Component
public class OfferParser {

    /** Entreprises connues (couvre les cibles fréquentes) reconnues directement. */
    private static final List<String> KNOWN_COMPANIES = List.of(
        "JCDecaux","Sopra Steria","Capgemini","Doctolib","Dassault","Thales","Orange","Atos",
        "Inetum","Devoteam","CGI","Sii","Amiltone","Talan","Extia","Meritis","Onepoint","Worldline",
        "OVHcloud","Decathlon","Adeo","Leroy Merlin","Boulanger","Kiabi","Norsys","Zenika","SFEIR",
        "Ippon","Theodo","OCTO","Publicis Sapient","Qonto","Swile","BlaBlaCar","Back Market","Alan",
        "PayFit","Pennylane","Contentsquare","Mirakl","Algolia","Malt","ManoMano","Dataiku","Ledger",
        "Believe","Veepee","Cdiscount","Akeneo","Younited","Sorare","Voodoo","Ubisoft","Ankama","Keyrus");

    private static final Map<String, String> CITIES = new LinkedHashMap<>();
    static {
        for (String c : List.of("Neuilly-sur-Seine","Levallois-Perret","Levallois","Boulogne-Billancourt",
                "Issy-les-Moulineaux","Saint-Denis","Ivry-sur-Seine","Montreuil","Nanterre","La Défense",
                "Paris","Lyon","Villeurbanne","Lille","Roubaix","Marseille","Toulouse","Bordeaux","Nantes",
                "Rennes","Strasbourg","Montpellier","Nice","Sophia Antipolis","Grenoble","Rouen","Lens",
                "Île-de-France","Ile-de-France")) {
            CITIES.put(c.toLowerCase(), c);
        }
    }

    private static final Pattern ROLE = Pattern.compile(
        "((?:Alternance|Stage)\\s+)?" +
        "((?:D[ée]veloppeur|Ing[ée]nieur|D[ée]veloppeuse|Concepteur|Software Engineer|Data Engineer|" +
        "DevOps|Full[- ]?stack|Back[- ]?end|Front[- ]?end)" +
        "(?:[\\p{L}0-9 ./&'+-]{0,40})?)",
        Pattern.CASE_INSENSITIVE);

    public static class Detected {
        public String company, role, location, contractType;
    }

    public Detected parse(String text) {
        Detected d = new Detected();
        if (text == null || text.isBlank()) return d;
        String lower = text.toLowerCase();

        // contrat
        if (lower.contains("altern") || lower.contains("apprentiss")) d.contractType = "Alternance";
        else if (lower.contains("stage") || lower.contains("intern")) d.contractType = "Stage";
        else if (lower.contains("cdi")) d.contractType = "CDI";
        else if (lower.contains("cdd")) d.contractType = "CDD";

        // lieu
        for (Map.Entry<String, String> e : CITIES.entrySet()) {
            if (lower.contains(e.getKey())) { d.location = e.getValue(); break; }
        }

        // entreprise : liste connue puis motifs "chez X" / "rejoindre X"
        for (String c : KNOWN_COMPANIES) {
            if (lower.contains(c.toLowerCase())) { d.company = c; break; }
        }
        if (d.company == null) {
            Matcher m = Pattern.compile(
                "(?:chez|rejoindre|int[ée]grer|au sein de(?: la DSI de)?)\\s+([A-Z][\\p{L}&.'-]+(?:\\s+[A-Z][\\p{L}&.'-]+)?)")
                .matcher(text);
            if (m.find()) d.company = m.group(1).trim();
        }

        // poste
        Matcher r = ROLE.matcher(text);
        if (r.find()) {
            String role = r.group(2).trim().replaceAll("\\s+", " ");
            // coupe si trop long / phrase
            role = role.split("(?i)\\b(au sein|pour|dans|chez|,|\\.|H/F|F/H)\\b")[0].trim();
            if (role.length() > 3) d.role = role;
        }
        return d;
    }
}
