package com.asheef.cryptogenie.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdviceResponse {
    private String recommendation;
    private Integer riskPercentage;
    private String rationale;
    private Double stopLoss;
    private Double takeProfit;
    private String disclaimer;
}
