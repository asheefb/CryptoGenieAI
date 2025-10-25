package com.asheef.cryptogenie.controller;

import com.asheef.cryptogenie.model.GameResult;
import com.asheef.cryptogenie.model.User;
import com.asheef.cryptogenie.repository.UserRepository;
import com.asheef.cryptogenie.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameService gameService;
    private final UserRepository userRepository;

    public GameController(GameService gameService, UserRepository userRepository) {
        this.gameService = gameService;
        this.userRepository = userRepository;
    }

    @PostMapping("/result")
    public ResponseEntity<GameResult> recordGameResult(@RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String gameType = (String) request.get("gameType");
            Boolean won = (Boolean) request.get("won");

            GameResult result = gameService.recordGameResult(user.getId(), gameType, won);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{gameType}/remaining")
    public ResponseEntity<Integer> getRemainingWins(@PathVariable String gameType, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        int remaining = gameService.getRemainingWins(user.getId(), gameType);
        return ResponseEntity.ok(remaining);
    }
}
