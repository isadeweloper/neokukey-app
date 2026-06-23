package com.cms.config;

import com.cms.repo.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class ApplicationConfig{

    private final UserRepository repository;

    public ApplicationConfig(UserRepository repository) {
        this.repository = repository;
    }

    @Bean
    public UserDetailsService userDetailsService(){
        return username -> repository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("user not found"));
    }

    @Bean
    public AuthenticationProvider authenticationProvider(UserDetailsService uds, BCryptPasswordEncoder enc) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(uds);
        provider.setPasswordEncoder(enc);
        return provider;
    }

    @Bean
    BCryptPasswordEncoder encoder(){
        return new BCryptPasswordEncoder();
    }

    /* Spring Boot 4 auto-configures a Jackson 3 mapper, but YandexGptService is
       written against the Jackson 2 ObjectMapper (on the classpath via
       jjwt-jackson). Provide that bean explicitly so it can be injected. */
    @Bean
    com.fasterxml.jackson.databind.ObjectMapper objectMapper(){
        return new com.fasterxml.jackson.databind.ObjectMapper();
    }
    @Bean
    AuthenticationManager authManager(AuthenticationConfiguration authConfiguraton) throws Exception{
        return authConfiguraton.getAuthenticationManager() ;
    }

}

