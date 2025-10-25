package com.asheef.cryptogenie.controller;

import com.asheef.cryptogenie.model.Stake;
import com.asheef.cryptogenie.model.User;
import com.asheef.cryptogenie.repository.UserRepository;
import com.asheef.cryptogenie.service.StakeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stakes")
public class StakeController {

    private final StakeService stakeService;
    private final UserRepository userRepository;

    public StakeController(StakeService stakeService, UserRepository userRepository) {
        this.stakeService = stakeService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Stake>> getUserStakes(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(stakeService.getUserStakes(user.getId()));
    }

    @PostMapping
    public ResponseEntity<Stake> createStake(@RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String coinSymbol = (String) request.get("coinSymbol");
            Double amount = ((Number) request.get("amount")).doubleValue();
            Integer lockDays = ((Number) request.get("lockDays")).intValue();

            Stake stake = stakeService.createStake(user.getId(), coinSymbol, amount, lockDays);
            return ResponseEntity.ok(stake);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{stakeId}/unstake")
    public ResponseEntity<String> unstake(@PathVariable Long stakeId, Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            stakeService.unstake(stakeId, user.getId());
            return ResponseEntity.ok("Unstaked successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{stakeId}/interest")
    public ResponseEntity<Double> calculateInterest(@PathVariable Long stakeId, Authentication authentication) {
        try {
            Stake stake = stakeService.getUserStakes(
                            userRepository.findByEmail(authentication.getName())
                                    .orElseThrow(() -> new RuntimeException("User not found")).getId()
                    ).stream().filter(s -> s.getId().equals(stakeId)).findFirst()
                    .orElseThrow(() -> new RuntimeException("Stake not found"));

            Double interest = stakeService.calculateInterest(stake);
            return ResponseEntity.ok(interest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
