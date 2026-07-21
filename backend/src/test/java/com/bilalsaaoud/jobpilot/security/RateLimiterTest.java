package com.bilalsaaoud.jobpilot.security;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class RateLimiterTest {

    @Test
    void allowsUpToCapacityThenBlocks() {
        RateLimiter rl = new RateLimiter(3, 60_000);
        assertThat(rl.allow("ip1", 0)).isTrue();
        assertThat(rl.allow("ip1", 1)).isTrue();
        assertThat(rl.allow("ip1", 2)).isTrue();
        assertThat(rl.allow("ip1", 3)).isFalse();   // 4e requête bloquée
    }

    @Test
    void resetsAfterWindow() {
        RateLimiter rl = new RateLimiter(2, 1_000);
        assertThat(rl.allow("ip", 0)).isTrue();
        assertThat(rl.allow("ip", 0)).isTrue();
        assertThat(rl.allow("ip", 500)).isFalse();
        assertThat(rl.allow("ip", 1_000)).isTrue();  // nouvelle fenêtre
    }

    @Test
    void keysAreIndependent() {
        RateLimiter rl = new RateLimiter(1, 60_000);
        assertThat(rl.allow("a", 0)).isTrue();
        assertThat(rl.allow("b", 0)).isTrue();
        assertThat(rl.allow("a", 0)).isFalse();
    }
}
