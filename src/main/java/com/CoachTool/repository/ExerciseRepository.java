package com.CoachTool.repository;

import com.CoachTool.entity.Exercise;
import com.CoachTool.entity.enums.ExerciseType;
import com.CoachTool.entity.enums.MuscleGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    List<Exercise> findByMuscleGroup(MuscleGroup muscleGroup);

    List<Exercise> findByExerciseType(ExerciseType exerciseType);

    List<Exercise> findByMuscleGroupAndExerciseType(MuscleGroup muscleGroup, ExerciseType exerciseType);

    boolean existsByName(String name);
}
