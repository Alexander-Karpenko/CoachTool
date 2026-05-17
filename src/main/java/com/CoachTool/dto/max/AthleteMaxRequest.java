package com.CoachTool.dto.max;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record AthleteMaxRequest(
        @NotNull Long exerciseId,
        @NotNull @DecimalMin("0.0") Double maxWeight,
        LocalDate recordedAt
) {}
