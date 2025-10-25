package com.asheef.cryptogenie.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "stakes")
@Data
@NoArgsConstructor
public class Stake {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String coinSymbol;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private Double dailyRate = 0.05;

    @Column(nullable = false)
    private LocalDateTime stakedAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime lockedUntil;

    @Column(nullable = false)
    private Boolean active = true;

    private LocalDateTime unstakedAt;

    public Stake(Long userId, String coinSymbol, Double amount, Integer lockDays) {
        this.userId = userId;
        this.coinSymbol = coinSymbol;
        this.amount = amount;
        this.dailyRate = 0.05;
        this.stakedAt = LocalDateTime.now();
        this.lockedUntil = LocalDateTime.now().plusDays(lockDays);
        this.active = true;
    }
}

