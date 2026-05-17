package com.CoachTool.repository;

import com.CoachTool.entity.TrainingExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingExerciseRepository extends JpaRepository<TrainingExercise, Long> {

    List<TrainingExercise> findByTrainingProgramIdOrderByOrderIndex(Long trainingProgramId);

    void deleteByTrainingProgramId(Long trainingProgramId);
}
