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

    static {
        try {
            String envDbUrl = System.getenv("DATABASE_URL");
            if (!StringUtils.hasText(envDbUrl)) {
                envDbUrl = System.getenv("SPRING_DATASOURCE_URL");
            }

            if (StringUtils.hasText(envDbUrl)) {
                String rawUrl = envDbUrl.trim();
                String jdbcUrl = rawUrl;
                String user = System.getenv("DATABASE_USERNAME");
                String pass = System.getenv("DATABASE_PASSWORD");

                if (rawUrl.startsWith("mysql://") || rawUrl.startsWith("postgres://")) {
                    URI uri = new URI(rawUrl);
                    String host = uri.getHost();
                    int port = uri.getPort();
                    String path = uri.getPath();
                    String query = uri.getQuery();
                    String userInfo = uri.getUserInfo();

                    StringBuilder sb = new StringBuilder("jdbc:mysql://");
                    sb.append(host);
                    if (port > 0) {
                        sb.append(":").append(port);
                    }
                    sb.append(path);

                    if (StringUtils.hasText(query)) {
                        sb.append("?").append(query);
                    } else {
                        sb.append("?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC");
                    }
                    jdbcUrl = sb.toString();

                    if (userInfo != null && userInfo.contains(":")) {
                        String[] userPass = userInfo.split(":", 2);
                        if (!StringUtils.hasText(user)) user = userPass[0];
                        if (!StringUtils.hasText(pass)) pass = userPass[1];
                    }
                } else if (!rawUrl.startsWith("jdbc:")) {
                    jdbcUrl = "jdbc:" + rawUrl;
                }

                System.setProperty("spring.datasource.url", jdbcUrl);
                System.setProperty("spring.flyway.url", jdbcUrl);
                if (StringUtils.hasText(user)) {
                    System.setProperty("spring.datasource.username", user);
                    System.setProperty("spring.flyway.user", user);
                }
                if (StringUtils.hasText(pass)) {
                    System.setProperty("spring.datasource.password", pass);
                    System.setProperty("spring.flyway.password", pass);
                }
                log.info("Static Database URL auto-sanitized to JDBC format: {}", jdbcUrl);
            }
        } catch (Exception e) {
            log.warn("Static Database URL sanitization warning: {}", e.getMessage());
        }
    }

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties dataSourceProperties() {
        DataSourceProperties properties = new DataSourceProperties();

        String envDbUrl = System.getenv("DATABASE_URL");
        if (!StringUtils.hasText(envDbUrl)) {
            envDbUrl = System.getenv("SPRING_DATASOURCE_URL");
        }

        if (StringUtils.hasText(envDbUrl)) {
            String sanitizedUrl = envDbUrl.trim();
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
                } catch (Exception e) {
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
