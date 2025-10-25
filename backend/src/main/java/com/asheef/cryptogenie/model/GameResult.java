package com.asheef.cryptogenie.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "game_results")
@Data
@NoArgsConstructor
public class GameResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String gameType;

    @Column(nullable = false)
    private Boolean won;

    @Column(nullable = false)
    private Double reward = 0.0;

    @Column(nullable = false)
    private LocalDateTime playedAt = LocalDateTime.now();

    public GameResult(Long userId, String gameType, Boolean won, Double reward) {
        this.userId = userId;
        this.gameType = gameType;
        this.won = won;
        this.reward = reward;
        this.playedAt = LocalDateTime.now();
    }
}
