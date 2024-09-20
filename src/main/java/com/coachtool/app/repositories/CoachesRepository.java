package com.coachtool.app.repositories;

import com.coachtool.app.domain.entity.Coach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CoachesRepository extends JpaRepository<Coach, Integer> {
    Optional<Coach> findByPhoneNumber(String phoneNumber);
}
