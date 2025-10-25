package com.asheef.cryptogenie.service.impl;

import com.asheef.cryptogenie.model.Transaction;
import com.asheef.cryptogenie.model.TransactionType;
import com.asheef.cryptogenie.model.User;
import com.asheef.cryptogenie.repository.TransactionRepository;
import com.asheef.cryptogenie.repository.UserRepository;
import com.asheef.cryptogenie.service.TransactionService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Transaction createTransaction(Long userId, String type, Double amount, String coinSymbol, String description) {
        TransactionType t = TransactionType.valueOf(type);
        Transaction transaction = new Transaction(userId, t, amount, coinSymbol, description);
        return transactionRepository.save(transaction);
    }

    @Override
    public void deposit(Long userId, Double amount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBalance(user.getBalance() + amount);
        userRepository.save(user);

        createTransaction(userId, "DEPOSIT", amount, null, "Simulated deposit");
    }

    @Override
    public void withdraw(Long userId, Double amount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        user.setBalance(user.getBalance() - amount);
        userRepository.save(user);

        createTransaction(userId, "WITHDRAW", amount, null, "Simulated withdrawal");
    }

    @Override
    public List<Transaction> getUserTransactions(Long userId) {
        return transactionRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}
