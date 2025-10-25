package com.asheef.cryptogenie.service;

import com.asheef.cryptogenie.model.MiningSession;
import org.springframework.transaction.annotation.Transactional;

public interface MiningService {

    @Transactional
    public MiningSession completeMining(Long userId, Integer durationSeconds);

    public int getRemainingMiningCount(Long userId);
}
