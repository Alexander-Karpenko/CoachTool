package com.CoachTool.dto.training;

import jakarta.validation.constraints.*;

public record TrainingExerciseRequest(
        @NotNull Long exerciseId,
        @Min(1) @Max(100) Integer sets,
        @Min(1) @Max(10000) Integer reps,
        @DecimalMin("0.0") Double weight,
        @DecimalMin("0.0") @DecimalMax("100.0") Double percentageOfMax,
        String comments,
        @NotNull @Min(0) Integer orderIndex,
        @Min(1) @Max(7) Integer dayOfWeek
) {}
