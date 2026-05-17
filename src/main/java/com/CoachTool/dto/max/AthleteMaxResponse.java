package com.CoachTool.dto.max;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AthleteMaxResponse(
        Long id,
        Long athleteId,
        Long exerciseId,
        String exerciseName,
        String muscleGroup,
        Double maxWeight,
        LocalDate recordedAt,
        LocalDateTime createdAt
) {}
