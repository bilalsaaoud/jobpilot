package com.bilalsaaoud.jobpilot.security;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/** Limiteur de débit à fenêtre fixe, par clé (ex: adresse IP). Thread-safe. */
public class RateLimiter {

    private final int capacity;
    private final long windowMillis;
    private final Map<String, Window> windows = new ConcurrentHashMap<>();

    private static final class Window {
        long start;
        int count;
    }

    public RateLimiter(int capacity, long windowMillis) {
        this.capacity = capacity;
        this.windowMillis = windowMillis;
    }

    public boolean allow(String key) {
        return allow(key, System.currentTimeMillis());
    }

    /** Visible pour les tests : contrôle du temps. */
    public boolean allow(String key, long now) {
        Window w = windows.computeIfAbsent(key, k -> new Window());
        synchronized (w) {
            if (now - w.start >= windowMillis) { w.start = now; w.count = 0; }
            if (w.count >= capacity) return false;
            w.count++;
            return true;
        }
    }

    /** Nettoyage occasionnel pour éviter que la map grossisse indéfiniment. */
    public void evictStale(long now) {
        windows.entrySet().removeIf(e -> now - e.getValue().start >= windowMillis * 2);
    }
}
