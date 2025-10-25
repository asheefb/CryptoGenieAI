package com.asheef.cryptogenie.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
