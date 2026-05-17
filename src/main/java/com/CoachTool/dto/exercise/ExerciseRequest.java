package com.CoachTool.dto.exercise;

import com.CoachTool.entity.enums.ExerciseType;
import com.CoachTool.entity.enums.LoadUnit;
import com.CoachTool.entity.enums.MuscleGroup;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ExerciseRequest(
        @NotBlank String name,
        @NotNull MuscleGroup muscleGroup,
        @NotNull ExerciseType exerciseType,
        @NotNull LoadUnit loadUnit,
        String description
) {}
