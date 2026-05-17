package com.CoachTool.dto.analytics;

import java.time.LocalDate;
import java.util.List;

public record PeriodReportResponse(
        Long athleteId,
        String athleteFirstName,
        String athleteLastName,
        LocalDate from,
        LocalDate to,
        VolumeStatsResponse volumeStats,
        List<WeeklyVolumePoint> weeklyChart,
        List<ExerciseSummary> exerciseSummaries
) {}
