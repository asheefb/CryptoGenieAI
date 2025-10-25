package com.asheef.cryptogenie.service;

import com.asheef.cryptogenie.dto.AuthRequest;
import com.asheef.cryptogenie.dto.AuthResponse;
import org.springframework.transaction.annotation.Transactional;

public interface AuthService {

    @Transactional
    public AuthResponse register(AuthRequest request);

    @Transactional
    public String login(AuthRequest request);

    public AuthResponse getCurrentUser(String email);

}
