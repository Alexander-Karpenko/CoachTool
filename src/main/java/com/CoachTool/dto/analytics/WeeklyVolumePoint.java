package com.CoachTool.dto.analytics;

import java.time.LocalDate;

public record WeeklyVolumePoint(
        LocalDate weekStart,
        double totalVolume,
        double averageIntensity,
        int exerciseCount,
        int trainingDays
) {}
