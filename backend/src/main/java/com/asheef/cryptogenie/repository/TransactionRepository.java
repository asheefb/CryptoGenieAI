package com.asheef.cryptogenie.repository;

import com.asheef.cryptogenie.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Transaction> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);
}
