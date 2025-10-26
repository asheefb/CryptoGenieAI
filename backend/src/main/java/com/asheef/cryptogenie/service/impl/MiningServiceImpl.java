package com.asheef.cryptogenie.service.impl;

import com.asheef.cryptogenie.model.MiningSession;
import com.asheef.cryptogenie.model.TransactionType;
import com.asheef.cryptogenie.model.User;
import com.asheef.cryptogenie.repository.MiningRepository;
import com.asheef.cryptogenie.repository.UserRepository;
import com.asheef.cryptogenie.service.MiningService;
import com.asheef.cryptogenie.service.TransactionService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MiningServiceImpl implements MiningService {

    private static final int MAX_MINING_PER_DAY = 3;
    private static final double BASE_REWARD = 5.0;

    private final MiningRepository miningRepository;
    private final UserRepository userRepository;
    private final TransactionService transactionService;

    public MiningServiceImpl(MiningRepository miningRepository, UserRepository userRepository, TransactionService transactionService) {
        this.miningRepository = miningRepository;
        this.userRepository = userRepository;
        this.transactionService = transactionService;
    }


    @Override
    public MiningSession completeMining(Long userId, Integer durationSeconds) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        List<MiningSession> todaySessions = miningRepository.findByUserIdAndMinedAtAfter(userId, today);

        if (todaySessions.size() >= MAX_MINING_PER_DAY) {
            throw new RuntimeException("Daily mining limit reached");
        }

        Double reward = BASE_REWARD * (durationSeconds / 60.0);
        reward = Math.min(reward, BASE_REWARD * 2);

        user.setBalance(user.getBalance() + reward);
        userRepository.save(user);

        MiningSession session = new MiningSession(userId, reward, durationSeconds);
        session = miningRepository.save(session);

        transactionService.createTransaction(userId, TransactionType.MINING, reward, null, "Mining reward");

        return session;
    }

    @Override
    public int getRemainingMiningCount(Long userId) {
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        List<MiningSession> todaySessions = miningRepository.findByUserIdAndMinedAtAfter(userId, today);
        return Math.max(0, MAX_MINING_PER_DAY - todaySessions.size());
    }
}
