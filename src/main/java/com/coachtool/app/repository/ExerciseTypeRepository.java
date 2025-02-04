package com.coachtool.app.repository;

import com.coachtool.app.domain.entity.ExerciseType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExerciseTypeRepository extends JpaRepository<ExerciseType, Long> {
}
