package com.asheef.cryptogenie.service;

import com.asheef.cryptogenie.model.Transaction;
import com.asheef.cryptogenie.model.TransactionType;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TransactionService {

    @Transactional
    public Transaction createTransaction(Long userId, TransactionType type, Double amount, String coinSymbol, String description);

    @Transactional
    public void deposit(Long userId, Double amount);

    @Transactional
    public void withdraw(Long userId, Double amount);

    public List<Transaction> getUserTransactions(Long userId);

    public List<Transaction> getAllTransactions();
}
