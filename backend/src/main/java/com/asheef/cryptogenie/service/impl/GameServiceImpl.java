package com.asheef.cryptogenie.service.impl;

import com.asheef.cryptogenie.model.GameResult;
import com.asheef.cryptogenie.model.User;
import com.asheef.cryptogenie.repository.GameResultRepository;
import com.asheef.cryptogenie.repository.UserRepository;
import com.asheef.cryptogenie.service.GameService;
import com.asheef.cryptogenie.service.TransactionService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class GameServiceImpl implements GameService {

    private static final double GAME_WIN_REWARD = 2.0;
    private static final int MAX_WINS_PER_DAY = 5;

    private final GameResultRepository gameResultRepository;
    private final UserRepository userRepository;
    private final TransactionService transactionService;

    public GameServiceImpl(GameResultRepository gameResultRepository, UserRepository userRepository, TransactionService transactionService) {
        this.gameResultRepository = gameResultRepository;
        this.userRepository = userRepository;
        this.transactionService = transactionService;
    }

    @Override
    public GameResult recordGameResult(Long userId, String gameType, Boolean won) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
            List<GameResult> todayWins = gameResultRepository.findByUserIdAndGameTypeAndPlayedAtAfter(
                    userId, gameType, today
            ).stream().filter(GameResult::getWon).toList();

            if (won && todayWins.size() >= MAX_WINS_PER_DAY) {
                throw new RuntimeException("Daily win limit reached for this game");
            }

            Double reward = won ? GAME_WIN_REWARD : 0.0;

            if (won) {
                user.setBalance(user.getBalance() + reward);
                userRepository.save(user);

                transactionService.createTransaction(userId, "GAME_REWARD", reward, null,
                        "Game win: " + gameType);
            }

            GameResult result = new GameResult(userId, gameType, won, reward);
            return gameResultRepository.save(result);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public int getRemainingWins(Long userId, String gameType) {
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        List<GameResult> todayWins = gameResultRepository.findByUserIdAndGameTypeAndPlayedAtAfter(
                userId, gameType, today
        ).stream().filter(GameResult::getWon).toList();

        return Math.max(0, MAX_WINS_PER_DAY - todayWins.size());
    }
}
