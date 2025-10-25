package com.asheef.cryptogenie.service.impl;

import com.asheef.cryptogenie.config.JWTUtil;
import com.asheef.cryptogenie.constants.Constant;
import com.asheef.cryptogenie.dto.AuthRequest;
import com.asheef.cryptogenie.dto.AuthResponse;
import com.asheef.cryptogenie.model.User;
import com.asheef.cryptogenie.repository.UserRepository;
import com.asheef.cryptogenie.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JWTUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JWTUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(Constant.EMAIL_EXIST);
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setBalance(1000.0);
        user.setIsAdmin(false);
        user.setEmailVerified(false);
        user.setCreatedAt(LocalDateTime.now());
        user.setLastLoginAt(LocalDateTime.now());

        user = userRepository.save(user);

        return new AuthResponse(
                user.getId(),
                user.getEmail(),
                user.getBalance(),
                user.getIsAdmin(),
                Constant.SUCCESS_MESSAGE
        );
    }

    @Override
    public String login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException(Constant.INVALID));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException(Constant.INVALID);
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        return jwtUtil.generateToken(user.getEmail(), user.getId(), user.getIsAdmin());
    }

    @Override
    public AuthResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(Constant.USER_NOT_FOUND));

        return new AuthResponse(
                user.getId(),
                user.getEmail(),
                user.getBalance(),
                user.getIsAdmin(),
                Constant.USER_FOUND
        );
    }
}
