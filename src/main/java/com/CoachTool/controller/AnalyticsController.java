package com.CoachTool.controller;

import com.CoachTool.dto.analytics.*;
import com.CoachTool.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('COACH')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    /**
     * Full period report: volume stats + weekly chart + per-exercise breakdown.
     * GET /api/analytics/athletes/1/period-report?from=2025-01-01&to=2025-03-31
     */
    @GetMapping("/athletes/{athleteId}/period-report")
    public ResponseEntity<PeriodReportResponse> getPeriodReport(
            @PathVariable Long athleteId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @AuthenticationPrincipal UserDetails principal) {

        return ResponseEntity.ok(analyticsService.getPeriodReport(athleteId, from, to, principal.getUsername()));
    }

    /**
     * Load + 1RM progress charts for an athlete.
     * GET /api/analytics/athletes/1/progress?from=...&to=...&exerciseId=5
     */
    @GetMapping("/athletes/{athleteId}/progress")
    public ResponseEntity<AthleteProgressResponse> getProgress(
            @PathVariable Long athleteId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) Long exerciseId,
            @AuthenticationPrincipal UserDetails principal) {

        return ResponseEntity.ok(analyticsService.getProgress(athleteId, exerciseId, from, to, principal.getUsername()));
    }

    /**
     * 1RM progression chart for a specific exercise.
     * GET /api/analytics/athletes/1/exercises/5/max-chart?from=...&to=...
     */
    @GetMapping("/athletes/{athleteId}/exercises/{exerciseId}/max-chart")
    public ResponseEntity<List<MaxProgressPoint>> getMaxChart(
            @PathVariable Long athleteId,
            @PathVariable Long exerciseId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @AuthenticationPrincipal UserDetails principal) {

        return ResponseEntity.ok(analyticsService.getMaxChart(athleteId, exerciseId, from, to, principal.getUsername()));
    }
}
