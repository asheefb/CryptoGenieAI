package com.asheef.cryptogenie.repository;

import com.asheef.cryptogenie.model.MiningSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MiningRepository extends JpaRepository<MiningSession, Long> {
    List<MiningSession> findByUserIdAndMinedAtAfter(Long userId, LocalDateTime after);
}
