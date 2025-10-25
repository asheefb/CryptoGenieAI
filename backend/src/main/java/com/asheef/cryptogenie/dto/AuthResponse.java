package com.asheef.cryptogenie.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private Long userId;
    private String email;
    private Double balance;
    private Boolean isAdmin;
    private String message;
}
