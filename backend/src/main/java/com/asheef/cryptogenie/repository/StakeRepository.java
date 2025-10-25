package com.asheef.cryptogenie.repository;


import com.asheef.cryptogenie.model.Stake;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StakeRepository extends JpaRepository<Stake, Long> {
    List<Stake> findByUserIdAndActive(Long userId, Boolean active);
}
