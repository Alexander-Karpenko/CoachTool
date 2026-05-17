package com.CoachTool.dto.training;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record TrainingProgramRequest(
        @NotBlank String title,
        LocalDate weekStartDate,
        String notes,
        @NotNull Long athleteId,
        @Valid List<TrainingExerciseRequest> exercises
) {}
