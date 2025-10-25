package com.asheef.cryptogenie.controller;

import com.asheef.cryptogenie.dto.AdviceResponse;
import com.asheef.cryptogenie.service.AdviceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/advice")
public class AdviceController {

    private final AdviceService adviceService;

    public AdviceController(AdviceService adviceService) {
        this.adviceService = adviceService;
    }

    @GetMapping("/{symbol}")
    public ResponseEntity<AdviceResponse> getAdvice(@PathVariable String symbol) {
        try {
            AdviceResponse advice = adviceService.getAdvice(symbol);
            return ResponseEntity.ok(advice);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
