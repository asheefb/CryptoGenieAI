package com.asheef.cryptogenie.controller;

import com.asheef.cryptogenie.model.Transaction;
import com.asheef.cryptogenie.model.TransactionType;
import com.asheef.cryptogenie.model.User;
import com.asheef.cryptogenie.repository.UserRepository;
import com.asheef.cryptogenie.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final TransactionService transactionService;

    public AdminController(UserRepository userRepository, TransactionService transactionService) {
        this.userRepository = userRepository;
        this.transactionService = transactionService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @PostMapping("/users/{userId}/reward")
    public ResponseEntity<String> issueReward(@PathVariable Long userId, @RequestBody Map<String, Object> request) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Double amount = ((Number) request.get("amount")).doubleValue();
            String description = (String) request.get("description");

            user.setBalance(user.getBalance() + amount);
            userRepository.save(user);

            transactionService.createTransaction(userId, TransactionType.ADMIN_REWARD, amount, null, description);

            return ResponseEntity.ok("Reward issued successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
