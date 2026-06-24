package com.cms.service;

import com.cms.config.JwtService;
import com.cms.dto.LoginRequest;
import com.cms.dto.RegisterRequest;
import com.cms.entity.Role;
import com.cms.entity.User;
import com.cms.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final BCryptPasswordEncoder encoder;

    public String loginAndGetToken(LoginRequest request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("user not found"));

        return jwtService.generateToken(Map.of("role", user.getRole().name()), user);
    }

    /** Public visitor (patient) registration: creates a USER account and logs in. */
    public String registerAndGetToken(RegisterRequest request){
        String username = request.getUsername() == null ? "" : request.getUsername().trim();
        String password = request.getPassword() == null ? "" : request.getPassword();

        if (username.isEmpty() || password.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "username and password are required");
        }
        if (userRepository.findByUsername(username).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "username already taken");
        }

        User user = User.builder()
                .username(username)
                .password(encoder.encode(password))
                .role(Role.USER)
                .build();
        userRepository.save(user);

        return jwtService.generateToken(Map.of("role", user.getRole().name()), user);
    }
}
