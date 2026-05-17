package com.CoachTool.service;

import com.CoachTool.dto.analytics.*;
import com.CoachTool.entity.Athlete;
import com.CoachTool.entity.AthleteMax;
import com.CoachTool.entity.TrainingExercise;
import com.CoachTool.entity.TrainingProgram;
import com.CoachTool.exception.ForbiddenException;
import com.CoachTool.exception.ResourceNotFoundException;
import com.CoachTool.repository.AthleteMaxRepository;
import com.CoachTool.repository.AthleteRepository;
import com.CoachTool.repository.TrainingProgramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final TrainingProgramRepository trainingProgramRepository;
    private final AthleteMaxRepository athleteMaxRepository;
    private final AthleteRepository athleteRepository;

    // Full period report: volume stats + weekly chart + per-exercise breakdown
    public PeriodReportResponse getPeriodReport(Long athleteId, LocalDate from, LocalDate to, String coachEmail) {
        Athlete athlete = requireOwnedAthlete(athleteId, coachEmail);

        List<TrainingProgram> programs = trainingProgramRepository
                .findForAnalytics(athleteId, athlete.getCoach().getId(), from, to);

        List<WeeklyVolumePoint> weeklyChart = buildWeeklyChart(programs);
        List<ExerciseSummary> exerciseSummaries = buildExerciseSummaries(programs, athleteId);
        VolumeStatsResponse stats = buildVolumeStats(athlete, from, to, weeklyChart, programs);

        return new PeriodReportResponse(
                athleteId, athlete.getFirstName(), athlete.getLastName(),
                from, to, stats, weeklyChart, exerciseSummaries);
    }

    // Progress chart: weekly load + optional 1RM dynamics for one exercise
    public AthleteProgressResponse getProgress(Long athleteId, Long exerciseId,
                                               LocalDate from, LocalDate to, String coachEmail) {
        Athlete athlete = requireOwnedAthlete(athleteId, coachEmail);

        List<TrainingProgram> programs = trainingProgramRepository
                .findForAnalytics(athleteId, athlete.getCoach().getId(), from, to);

        List<WeeklyVolumePoint> loadChart = buildWeeklyChart(programs);

        List<MaxProgressPoint> maxChart = exerciseId != null
                ? buildMaxChart(athleteId, exerciseId, from, to)
                : Collections.emptyList();

        double volChange = changePercent(loadChart, WeeklyVolumePoint::totalVolume);
        double intensityChange = changePercent(loadChart, WeeklyVolumePoint::averageIntensity);

        return new AthleteProgressResponse(athleteId, loadChart, maxChart, volChange, intensityChange);
    }

    // 1RM progression chart for a specific exercise
    public List<MaxProgressPoint> getMaxChart(Long athleteId, Long exerciseId,
                                               LocalDate from, LocalDate to, String coachEmail) {
        requireOwnedAthlete(athleteId, coachEmail);
        return buildMaxChart(athleteId, exerciseId, from, to);
    }

    // ── private helpers ──────────────────────────────────────────────────────

    private List<WeeklyVolumePoint> buildWeeklyChart(List<TrainingProgram> programs) {
        return programs.stream()
                .map(p -> new WeeklyVolumePoint(
                        p.getWeekStartDate(),
                        round2(programVolume(p)),
                        round2(avgIntensity(p.getExercises())),
                        p.getExercises().size(),
                        countTrainingDays(p)))
                .toList();
    }

    /** Distinct days with exercises (1–7). Falls back to 1 for old data without dayOfWeek. */
    private int countTrainingDays(TrainingProgram p) {
        long days = p.getExercises().stream()
                .map(TrainingExercise::getDayOfWeek)
                .filter(Objects::nonNull)
                .distinct()
                .count();
        return days > 0 ? (int) days : (p.getExercises().isEmpty() ? 0 : 1);
    }

    private List<ExerciseSummary> buildExerciseSummaries(List<TrainingProgram> programs, Long athleteId) {
        // group all TrainingExercise entries by exercise ID
        Map<Long, List<TrainingExercise>> byExercise = programs.stream()
                .flatMap(p -> p.getExercises().stream())
                .collect(Collectors.groupingBy(te -> te.getExercise().getId()));

        return byExercise.entrySet().stream()
                .map(e -> buildExerciseSummary(e.getKey(), e.getValue(), athleteId))
                .sorted(Comparator.comparingDouble(ExerciseSummary::totalVolume).reversed())
                .toList();
    }

    private ExerciseSummary buildExerciseSummary(Long exerciseId,
                                                   List<TrainingExercise> exercises,
                                                   Long athleteId) {
        String name = exercises.get(0).getExercise().getName();
        String muscleGroup = exercises.get(0).getExercise().getMuscleGroup().name();

        int totalSets  = exercises.stream().mapToInt(te -> te.getSets() != null ? te.getSets() : 0).sum();
        int totalReps  = exercises.stream().mapToInt(te -> te.getReps() != null ? te.getReps() : 0).sum();
        double totalVol = round2(exercises.stream().mapToDouble(this::exerciseVolume).sum());

        double avgWeight = round2(exercises.stream()
                .filter(te -> te.getWeight() != null)
                .mapToDouble(TrainingExercise::getWeight)
                .average().orElse(0));

        double avgIntensity = round2(exercises.stream()
                .filter(te -> te.getPercentageOfMax() != null && te.getPercentageOfMax() > 0)
                .mapToDouble(TrainingExercise::getPercentageOfMax)
                .average().orElse(0));

        double currentMax = athleteMaxRepository
                .findFirstByAthleteIdAndExerciseIdOrderByRecordedAtDesc(athleteId, exerciseId)
                .map(AthleteMax::getMaxWeight)
                .orElse(0.0);

        return new ExerciseSummary(exerciseId, name, muscleGroup,
                totalSets, totalReps, totalVol, avgWeight, avgIntensity, currentMax);
    }

    private VolumeStatsResponse buildVolumeStats(Athlete athlete, LocalDate from, LocalDate to,
                                                  List<WeeklyVolumePoint> chart,
                                                  List<TrainingProgram> programs) {
        double total   = round2(chart.stream().mapToDouble(WeeklyVolumePoint::totalVolume).sum());
        double avgWeek = chart.isEmpty() ? 0 : round2(total / chart.size());
        double peak    = round2(chart.stream().mapToDouble(WeeklyVolumePoint::totalVolume).max().orElse(0));
        double avgInt  = round2(chart.stream().filter(p -> p.averageIntensity() > 0)
                .mapToDouble(WeeklyVolumePoint::averageIntensity).average().orElse(0));

        int totalExercises    = programs.stream().mapToInt(p -> p.getExercises().size()).sum();
        int totalTrainingDays = chart.stream().mapToInt(WeeklyVolumePoint::trainingDays).sum();
        double avgDailyVolume = totalTrainingDays > 0 ? round2(total / totalTrainingDays) : 0;

        return new VolumeStatsResponse(
                athlete.getId(), athlete.getFirstName(), athlete.getLastName(), from, to,
                total, avgWeek, peak, avgInt,
                changePercent(chart, WeeklyVolumePoint::totalVolume),
                changePercent(chart, WeeklyVolumePoint::averageIntensity),
                programs.size(), totalExercises, avgDailyVolume);
    }

    private List<MaxProgressPoint> buildMaxChart(Long athleteId, Long exerciseId,
                                                   LocalDate from, LocalDate to) {
        List<AthleteMax> maxes = athleteMaxRepository
                .findByAthleteIdAndExerciseIdAndPeriod(athleteId, exerciseId, from, to);

        List<MaxProgressPoint> points = new ArrayList<>();
        Double prev = null;
        for (AthleteMax m : maxes) {
            double change = prev != null ? round2((m.getMaxWeight() - prev) / prev * 100) : 0;
            points.add(new MaxProgressPoint(m.getRecordedAt(), m.getMaxWeight(), change));
            prev = m.getMaxWeight();
        }
        return points;
    }

    // V = weight × reps × sets
    private double exerciseVolume(TrainingExercise te) {
        if (te.getSets() == null || te.getReps() == null) return 0;
        double w = te.getWeight() != null ? te.getWeight() : 0;
        return w * te.getSets() * te.getReps();
    }

    private double programVolume(TrainingProgram p) {
        return p.getExercises().stream().mapToDouble(this::exerciseVolume).sum();
    }

    private double avgIntensity(List<TrainingExercise> exercises) {
        return exercises.stream()
                .filter(te -> te.getPercentageOfMax() != null && te.getPercentageOfMax() > 0)
                .mapToDouble(TrainingExercise::getPercentageOfMax)
                .average().orElse(0);
    }

    private <T> double changePercent(List<T> list, java.util.function.ToDoubleFunction<T> fn) {
        if (list.size() < 2) return 0;
        double first = fn.applyAsDouble(list.get(0));
        double last  = fn.applyAsDouble(list.get(list.size() - 1));
        return first == 0 ? 0 : round2((last - first) / first * 100);
    }

    private double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }

    private Athlete requireOwnedAthlete(Long athleteId, String coachEmail) {
        Athlete athlete = athleteRepository.findById(athleteId)
                .orElseThrow(() -> new ResourceNotFoundException("Athlete", athleteId));
        if (!athlete.getCoach().getEmail().equals(coachEmail)) throw new ForbiddenException();
        return athlete;
    }
}
