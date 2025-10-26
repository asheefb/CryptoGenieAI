package com.asheef.cryptogenie.service.impl;

import com.asheef.cryptogenie.model.Stake;
import com.asheef.cryptogenie.model.TransactionType;
import com.asheef.cryptogenie.model.User;
import com.asheef.cryptogenie.repository.StakeRepository;
import com.asheef.cryptogenie.repository.UserRepository;
import com.asheef.cryptogenie.service.StakeService;
import com.asheef.cryptogenie.service.TransactionService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class StakeServiceImpl implements StakeService {

    private final StakeRepository stakeRepository;
    private final UserRepository userRepository;
    private final TransactionService transactionService;

    public StakeServiceImpl(StakeRepository stakeRepository, UserRepository userRepository, TransactionService transactionService) {
        this.stakeRepository = stakeRepository;
        this.userRepository = userRepository;
        this.transactionService = transactionService;
    }

    @Override
    public Stake createStake(Long userId, String coinSymbol, Double amount, Integer lockDays) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        user.setBalance(user.getBalance() - amount);
        userRepository.save(user);

        Stake stake = new Stake(userId, coinSymbol, amount, lockDays);
        stake = stakeRepository.save(stake);

        transactionService.createTransaction(userId, TransactionType.STAKE, amount, coinSymbol, "Staked for " + lockDays + " days");
        return stake;
    }

    @Override
    public Double calculateInterest(Stake stake) {
        long daysPassed = ChronoUnit.DAYS.between(stake.getStakedAt(), LocalDateTime.now());
        return stake.getAmount() * stake.getDailyRate() * daysPassed / 100;
    }

    @Override
    public void unstake(Long stakeId, Long userId) {
        Stake stake = stakeRepository.findById(stakeId)
                .orElseThrow(() -> new RuntimeException("Stake not found"));

        if (!stake.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }

        if (!stake.getActive()) {
            throw new RuntimeException("Stake already unstaked");
        }

        if (LocalDateTime.now().isBefore(stake.getLockedUntil())) {
            throw new RuntimeException("Stake is still locked");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Double interest = calculateInterest(stake);
        Double totalAmount = stake.getAmount() + interest;

        user.setBalance(user.getBalance() + totalAmount);
        userRepository.save(user);

        stake.setActive(false);
        stake.setUnstakedAt(LocalDateTime.now());
        stakeRepository.save(stake);

        transactionService.createTransaction(userId, TransactionType.UNSTAKE, totalAmount, stake.getCoinSymbol(),
                "Unstaked with interest: " + interest);
    }

    @Override
    public List<Stake> getUserStakes(Long userId) {
        return stakeRepository.findByUserIdAndActive(userId, true);
    }
}
