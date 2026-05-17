package com.CoachTool.dto.analytics;

public record ExerciseSummary(
        Long exerciseId,
        String exerciseName,
        String muscleGroup,
        int totalSets,
        int totalReps,
        double totalVolume,
        double averageWeight,
        double averageIntensity,
        double currentMax
) {}
