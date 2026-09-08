package com.billstack.config;

import org.flywaydb.core.Flyway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlywayConfig {

    private static final Logger log = LoggerFactory.getLogger(FlywayConfig.class);

    @Bean
    public FlywayMigrationStrategy flywayMigrationStrategy() {
        return flyway -> {
            log.info("Executing Flyway repair to clear any previous failed migration history entries...");
            try {
                flyway.repair();
            } catch (Exception ex) {
                log.warn("Flyway repair warning (continuing with migration): {}", ex.getMessage());
            }
            log.info("Executing Flyway database migration...");
            try {
                flyway.migrate();
            } catch (Exception ex) {
                log.error("Flyway migration error (continuing application startup): {}", ex.getMessage());
            }
        };
    }
}
