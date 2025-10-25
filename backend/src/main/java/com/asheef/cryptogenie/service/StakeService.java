package com.asheef.cryptogenie.service;

import com.asheef.cryptogenie.model.Stake;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface StakeService {

    @Transactional
    public Stake createStake(Long userId, String coinSymbol, Double amount, Integer lockDays);

    public Double calculateInterest(Stake stake);

    @Transactional
    public void unstake(Long stakeId, Long userId);

    public List<Stake> getUserStakes(Long userId);
}
