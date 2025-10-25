package com.asheef.cryptogenie.service;

import com.asheef.cryptogenie.model.GameResult;
import org.springframework.transaction.annotation.Transactional;

public interface GameService {

    @Transactional
    public GameResult recordGameResult(Long userId, String gameType, Boolean won);

    public int getRemainingWins(Long userId, String gameType);
}
