package com.cms.config;

import com.cms.entity.Role;
import com.cms.entity.User;
import com.cms.repo.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds a default ADMIN user on startup when the users table is empty, so the
 * JWT/JDBC auth flow is usable out of the box. Idempotent: does nothing once any
 * user exists. Credentials come from env (ADMIN_USERNAME / ADMIN_PASSWORD).
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;
    private final String adminUsername;
    private final String adminPassword;

    public DataSeeder(UserRepository userRepository,
                      BCryptPasswordEncoder encoder,
                      @Value("${admin.username:admin}") String adminUsername,
                      @Value("${admin.password:admin}") String adminPassword) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // users already exist — leave them untouched
        }
        User admin = User.builder()
                .username(adminUsername)
                .password(encoder.encode(adminPassword))
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);
        System.out.println("[DataSeeder] Created default ADMIN user '" + adminUsername + "'");
    }
}
