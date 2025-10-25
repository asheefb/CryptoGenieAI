package com.asheef.cryptogenie.service;

import com.asheef.cryptogenie.dto.CoinDTO;

import java.util.List;

public interface CoinService {

    public List<CoinDTO> getTopCoins(Integer limit);

    public CoinDTO getCoinBySymbol(String symbol);
}
