package com.asheef.cryptogenie.controller;

import com.asheef.cryptogenie.model.MiningSession;
import com.asheef.cryptogenie.model.User;
import com.asheef.cryptogenie.repository.UserRepository;
import com.asheef.cryptogenie.service.MiningService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

        import java.util.Map;

@RestController
@RequestMapping("/api/mining")
public class MiningController {

    private final MiningService miningService;
    private final UserRepository userRepository;

    public MiningController(MiningService miningService, UserRepository userRepository) {
        this.miningService = miningService;
        this.userRepository = userRepository;
    }

    @PostMapping("/complete")
    public ResponseEntity<MiningSession> completeMining(@RequestBody Map<String, Integer> request, Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Integer durationSeconds = request.get("durationSeconds");
            MiningSession session = miningService.completeMining(user.getId(), durationSeconds);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/remaining")
    public ResponseEntity<Integer> getRemainingMining(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        int remaining = miningService.getRemainingMiningCount(user.getId());
        return ResponseEntity.ok(remaining);
    }
}
