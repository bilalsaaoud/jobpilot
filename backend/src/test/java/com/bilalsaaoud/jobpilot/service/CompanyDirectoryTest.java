package com.bilalsaaoud.jobpilot.service;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class CompanyDirectoryTest {
    private final CompanyDirectory dir = new CompanyDirectory();

    @Test
    void prefixMatchComesFirst() {
        var res = dir.search("cap", 8);
        assertThat(res).isNotEmpty();
        assertThat(res.get(0).name()).isEqualTo("Capgemini");
    }

    @Test
    void emptyQueryReturnsNothing() {
        assertThat(dir.search("", 8)).isEmpty();
    }

    @Test
    void limitIsRespected() {
        assertThat(dir.search("e", 5).size()).isLessThanOrEqualTo(5);
    }
}
