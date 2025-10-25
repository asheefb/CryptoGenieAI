package com.asheef.cryptogenie.service.impl;

import com.asheef.cryptogenie.constants.Constant;
import com.asheef.cryptogenie.dto.AdviceResponse;
import com.asheef.cryptogenie.dto.CoinDTO;
import com.asheef.cryptogenie.service.AdviceService;
import com.asheef.cryptogenie.service.CoinService;
import org.springframework.stereotype.Service;

@Service
public class AdviceServiceImpl implements AdviceService {

    private final CoinService coinService;

    public AdviceServiceImpl(CoinService coinService) {
        this.coinService = coinService;
    }

    @Override
    public AdviceResponse getAdvice(String symbol) {
        CoinDTO coin = coinService.getCoinBySymbol(symbol);

        double priceChange = coin.getPriceChangePercentage24h();
        String recommendation;
        int riskPercentage;
        String rationale;
        Double stopLoss;
        Double takeProfit;

        if (priceChange > 5) {
            recommendation = Constant.HOLD;
            riskPercentage = 60;
            rationale = Constant.INCREASED_MESSAGE;
            stopLoss = coin.getCurrentPrice() * 0.90;
            takeProfit = coin.getCurrentPrice() * 1.10;
        } else if (priceChange > 0) {
            recommendation = Constant.BUY;
            riskPercentage = 45;
            rationale = Constant.MODERATE_MESSAGE;
            stopLoss = coin.getCurrentPrice() * 0.93;
            takeProfit = coin.getCurrentPrice() * 1.15;
        } else if (priceChange > -5) {
            recommendation = Constant.HOLD;
            riskPercentage = 55;
            rationale = Constant.NEGATIVE_MESSAGE;
            stopLoss = coin.getCurrentPrice() * 0.88;
            takeProfit = coin.getCurrentPrice() * 1.12;
        } else {
            recommendation = Constant.SELL;
            riskPercentage = 75;
            rationale = Constant.DOWNWARD_MOMENT;
            stopLoss = coin.getCurrentPrice() * 0.85;
            takeProfit = coin.getCurrentPrice() * 1.20;
        }

        String disclaimer = Constant.DISCLAIMER;

        return new AdviceResponse(recommendation, riskPercentage, rationale, stopLoss, takeProfit, disclaimer);
    }
}
