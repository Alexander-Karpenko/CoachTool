package com.CoachTool.dto.analytics;

import java.util.List;

public record AthleteProgressResponse(
        Long athleteId,
        List<WeeklyVolumePoint> loadChart,
        List<MaxProgressPoint> maxChart,
        double volumeChangePercent,
        double intensityChangePercent
) {}
