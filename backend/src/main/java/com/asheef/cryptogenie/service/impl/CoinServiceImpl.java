package com.asheef.cryptogenie.service.impl;

import com.asheef.cryptogenie.dto.CoinDTO;
import com.asheef.cryptogenie.service.CoinService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class CoinServiceImpl implements CoinService {

    @Value("${coingecko.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public CoinServiceImpl() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public List<CoinDTO> getTopCoins(Integer limit) {
        try {
            String url = apiUrl + "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=" + limit + "&page=1&sparkline=false";
            String response = restTemplate.getForObject(url, String.class);

            JsonNode rootNode = objectMapper.readTree(response);
            List<CoinDTO> coins = new ArrayList<>();

            for (JsonNode node : rootNode) {
                CoinDTO coin = new CoinDTO();
                coin.setId(node.get("id").asText());
                coin.setSymbol(node.get("symbol").asText().toUpperCase());
                coin.setName(node.get("name").asText());
                coin.setCurrentPrice(node.get("current_price").asDouble());
                coin.setMarketCap(node.get("market_cap").asDouble());
                coin.setPriceChange24h(node.get("price_change_24h").asDouble());
                coin.setPriceChangePercentage24h(node.get("price_change_percentage_24h").asDouble());
                coin.setImage(node.get("image").asText());
                coins.add(coin);
            }

            return coins;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch coins: " + e.getMessage());
        }
    }

    @Override
    public CoinDTO getCoinBySymbol(String symbol) {
        try {
            List<CoinDTO> coins = getTopCoins(250);
            return coins.stream()
                    .filter(c -> c.getSymbol().equalsIgnoreCase(symbol))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Coin not found"));
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch coin: " + e.getMessage());
        }
    }
}
