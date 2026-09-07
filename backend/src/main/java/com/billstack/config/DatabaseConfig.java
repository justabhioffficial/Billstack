package com.billstack.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.util.StringUtils;

import java.net.URI;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties dataSourceProperties() {
        DataSourceProperties properties = new DataSourceProperties();

        // Environment variables override resolution (Render, Railway, Heroku)
        String envDbUrl = System.getenv("DATABASE_URL");
        if (!StringUtils.hasText(envDbUrl)) {
            envDbUrl = System.getenv("SPRING_DATASOURCE_URL");
        }

        if (StringUtils.hasText(envDbUrl)) {
            log.info("Detected custom Database URL from environment: {}", envDbUrl.replaceAll(":([^@]+)@", ":****@"));
            String sanitizedUrl = envDbUrl.trim();

            // Convert mysql:// or postgres:// URI into valid JDBC URL
            if (sanitizedUrl.startsWith("mysql://") || sanitizedUrl.startsWith("postgres://")) {
                try {
                    URI uri = new URI(sanitizedUrl);
                    String host = uri.getHost();
                    int port = uri.getPort();
                    String path = uri.getPath();
                    String query = uri.getQuery();
                    String userInfo = uri.getUserInfo();

                    StringBuilder jdbcUrl = new StringBuilder("jdbc:mysql://");
                    jdbcUrl.append(host);
                    if (port > 0) {
                        jdbcUrl.append(":").append(port);
                    }
                    jdbcUrl.append(path);

                    if (StringUtils.hasText(query)) {
                        jdbcUrl.append("?").append(query);
                    } else {
                        jdbcUrl.append("?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC");
                    }

                    properties.setUrl(jdbcUrl.toString());

                    if (userInfo != null && userInfo.contains(":")) {
                        String[] userPass = userInfo.split(":", 2);
                        properties.setUsername(userPass[0]);
                        properties.setPassword(userPass[1]);
                    }
                    log.info("Auto-converted Render Database URI to valid JDBC URL format: {}", properties.getUrl());
                } catch (Exception e) {
                    log.warn("Unable to parse URI, fallback to raw url prepending jdbc:: {}", e.getMessage());
                    properties.setUrl("jdbc:" + sanitizedUrl);
                }
            } else if (!sanitizedUrl.startsWith("jdbc:")) {
                properties.setUrl("jdbc:" + sanitizedUrl);
            } else {
                properties.setUrl(sanitizedUrl);
            }
        }

        String envUser = System.getenv("DATABASE_USERNAME");
        if (StringUtils.hasText(envUser)) {
            properties.setUsername(envUser.trim());
        }

        String envPass = System.getenv("DATABASE_PASSWORD");
        if (StringUtils.hasText(envPass)) {
            properties.setPassword(envPass.trim());
        }

        return properties;
    }
}
