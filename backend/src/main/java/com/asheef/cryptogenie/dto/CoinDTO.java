package com.asheef.cryptogenie.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoinDTO {
    private String id;
    private String symbol;
    private String name;
    private Double currentPrice;
    private Double marketCap;
    private Double priceChange24h;
    private Double priceChangePercentage24h;
    private String image;
}
