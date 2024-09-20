package com.coachtool.app.repositories;

import com.coachtool.app.domain.entity.TrainingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainingPlanRepository extends JpaRepository<TrainingPlan, Integer> {

}
