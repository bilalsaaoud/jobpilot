package com.bilalsaaoud.jobpilot.security;

import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.assertj.core.api.Assertions.assertThat;

class SecurityHeadersFilterTest {

    @Test
    void addsSecurityHeaders() throws Exception {
        var filter = new SecurityHeadersFilter();
        var req = new MockHttpServletRequest("GET", "/api/domains");
        var res = new MockHttpServletResponse();
        FilterChain chain = (a, b) -> {};

        filter.doFilter(req, res, chain);

        assertThat(res.getHeader("X-Content-Type-Options")).isEqualTo("nosniff");
        assertThat(res.getHeader("X-Frame-Options")).isEqualTo("DENY");
        assertThat(res.getHeader("Content-Security-Policy")).contains("frame-ancestors 'none'");
        assertThat(res.getHeader("Referrer-Policy")).isEqualTo("no-referrer");
    }
}
