package com.asheef.cryptogenie.repository;

import com.asheef.cryptogenie.model.Coin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoinRepository extends JpaRepository<Coin,Long> {
}
