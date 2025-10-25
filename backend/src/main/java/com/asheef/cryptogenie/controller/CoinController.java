package com.asheef.cryptogenie.controller;

import com.asheef.cryptogenie.dto.CoinDTO;
import com.asheef.cryptogenie.service.CoinService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coins")
public class CoinController {

    private final CoinService coinService;

    public CoinController(CoinService coinService) {
        this.coinService = coinService;
    }

    @GetMapping
    public ResponseEntity<List<CoinDTO>> getTopCoins(@RequestParam(defaultValue = "20") int limit) {
        try {
            List<CoinDTO> coins = coinService.getTopCoins(limit);
            return ResponseEntity.ok(coins);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{symbol}")
    public ResponseEntity<CoinDTO> getCoinBySymbol(@PathVariable String symbol) {
        try {
            CoinDTO coin = coinService.getCoinBySymbol(symbol);
            return ResponseEntity.ok(coin);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
