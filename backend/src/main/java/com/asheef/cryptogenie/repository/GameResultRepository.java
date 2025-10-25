package com.asheef.cryptogenie.repository;

import com.asheef.cryptogenie.model.GameResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GameResultRepository extends JpaRepository<GameResult, Long> {
    List<GameResult> findByUserIdAndGameTypeAndPlayedAtAfter(Long userId, String gameType, LocalDateTime after);
}
