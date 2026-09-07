package com.billstack.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.util.StringUtils;

import java.net.InetAddress;
import java.net.URI;
import java.net.UnknownHostException;

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

                    // Pre-verify DNS resolution for external database host
                    boolean hostValid = isHostResolvable(host);
                    if (!hostValid) {
                        log.warn("Host '{}' is unresolvable via DNS. Falling back to built-in H2 database in MySQL mode for instant launch.", host);
                        jdbcUrl = "jdbc:h2:mem:billstackdb;MODE=MySQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1";
                        user = "sa";
                        pass = "";
                        System.setProperty("spring.datasource.driver-class-name", "org.h2.Driver");
                        System.setProperty("spring.jpa.database-platform", "org.hibernate.dialect.H2Dialect");
                    } else {
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
                    }
                } else if (rawUrl.startsWith("jdbc:mysql://")) {
                    try {
                        String cleanHostUrl = rawUrl.substring(13);
                        int slashIdx = cleanHostUrl.indexOf('/');
                        int colonIdx = cleanHostUrl.indexOf(':');
                        int endIdx = (colonIdx > 0 && colonIdx < slashIdx) ? colonIdx : (slashIdx > 0 ? slashIdx : cleanHostUrl.length());
                        String host = cleanHostUrl.substring(0, endIdx);

                        if (!isHostResolvable(host)) {
                            log.warn("JDBC Host '{}' is unresolvable via DNS. Falling back to built-in H2 database in MySQL mode.", host);
                            jdbcUrl = "jdbc:h2:mem:billstackdb;MODE=MySQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1";
                            user = "sa";
                            pass = "";
                            System.setProperty("spring.datasource.driver-class-name", "org.h2.Driver");
                            System.setProperty("spring.jpa.database-platform", "org.hibernate.dialect.H2Dialect");
                        }
                    } catch (Exception ignored) {}
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
                log.info("Database URL auto-sanitization result: {}", jdbcUrl);
            }
        } catch (Exception e) {
            log.warn("Static Database URL sanitization warning: {}", e.getMessage());
        }
    }

    private static boolean isHostResolvable(String host) {
        if (!StringUtils.hasText(host) || "localhost".equalsIgnoreCase(host) || "127.0.0.1".equals(host)) {
            return true;
        }
        try {
            InetAddress.getByName(host);
            return true;
        } catch (UnknownHostException e) {
            return false;
        }
    }

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties dataSourceProperties() {
        DataSourceProperties properties = new DataSourceProperties();
        String sysUrl = System.getProperty("spring.datasource.url");
        if (StringUtils.hasText(sysUrl)) {
            properties.setUrl(sysUrl);
            properties.setUsername(System.getProperty("spring.datasource.username"));
            properties.setPassword(System.getProperty("spring.datasource.password"));
            String driver = System.getProperty("spring.datasource.driver-class-name");
            if (StringUtils.hasText(driver)) {
                properties.setDriverClassName(driver);
            }
        }
        return properties;
    }
}
