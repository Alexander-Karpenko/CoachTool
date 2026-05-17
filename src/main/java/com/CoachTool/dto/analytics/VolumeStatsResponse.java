package com.CoachTool.dto.analytics;

import java.time.LocalDate;

public record VolumeStatsResponse(
        Long athleteId,
        String athleteFirstName,
        String athleteLastName,
        LocalDate from,
        LocalDate to,
        double totalVolume,
        double averageWeeklyVolume,
        double peakWeeklyVolume,
        double averageIntensity,
        double volumeChangePercent,
        double intensityChangePercent,
        int totalPrograms,
        int totalExercises,
        double avgDailyVolume
) {}
