package com.asheef.cryptogenie.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "mining_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MiningSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Double reward;

    @Column(nullable = false)
    private Integer durationSeconds;

    @Column(nullable = false)
    private LocalDateTime minedAt = LocalDateTime.now();

    public MiningSession(Long userId, Double reward, Integer durationSeconds) {
        this.userId = userId;
        this.reward = reward;
        this.durationSeconds = durationSeconds;
        this.minedAt = LocalDateTime.now();
    }
}
