package com.CoachTool.dto.training;

import com.CoachTool.entity.enums.ExerciseType;
import com.CoachTool.entity.enums.LoadUnit;
import com.CoachTool.entity.enums.MuscleGroup;

public record TrainingExerciseResponse(
        Long id,
        Integer sets,
        Integer reps,
        Double weight,
        Double percentageOfMax,
        String comments,
        Integer orderIndex,
        Integer dayOfWeek,
        Long exerciseId,
        String exerciseName,
        MuscleGroup muscleGroup,
        ExerciseType exerciseType,
        LoadUnit loadUnit
) {}
