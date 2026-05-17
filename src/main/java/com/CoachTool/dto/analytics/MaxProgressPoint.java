package com.CoachTool.dto.analytics;

import java.time.LocalDate;

public record MaxProgressPoint(
        LocalDate recordedAt,
        double maxWeight,
        double changePercent
) {}
