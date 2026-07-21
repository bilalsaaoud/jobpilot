package com.bilalsaaoud.jobpilot.service.ai;

/** Moteur de generation de contenu (mot de motivation + conseils CV). */
public interface AiClient {
    GenerationResult generate(GenerationContext ctx);
    String name();
}
