package com.CoachTool.dto.exercise;

import com.CoachTool.entity.enums.ExerciseType;
import com.CoachTool.entity.enums.LoadUnit;
import com.CoachTool.entity.enums.MuscleGroup;

public record ExerciseResponse(
        Long id,
        String name,
        MuscleGroup muscleGroup,
        ExerciseType exerciseType,
        LoadUnit loadUnit,
        String description
) {}
