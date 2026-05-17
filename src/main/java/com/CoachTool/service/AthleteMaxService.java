package com.CoachTool.service;

import com.CoachTool.dto.max.AthleteMaxRequest;
import com.CoachTool.dto.max.AthleteMaxResponse;
import com.CoachTool.entity.Athlete;
import com.CoachTool.entity.AthleteMax;
import com.CoachTool.entity.Exercise;
import com.CoachTool.exception.ForbiddenException;
import com.CoachTool.exception.ResourceNotFoundException;
import com.CoachTool.mapper.AthleteMaxMapper;
import com.CoachTool.repository.AthleteMaxRepository;
import com.CoachTool.repository.AthleteRepository;
import com.CoachTool.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AthleteMaxService {

    private final AthleteMaxRepository athleteMaxRepository;
    private final AthleteRepository athleteRepository;
    private final ExerciseRepository exerciseRepository;
    private final AthleteMaxMapper athleteMaxMapper;

    @Transactional(readOnly = true)
    public List<AthleteMaxResponse> getAllByAthlete(Long athleteId, String coachEmail) {
        requireOwnedAthlete(athleteId, coachEmail);
        return athleteMaxRepository.findByAthleteIdOrderByRecordedAtDesc(athleteId)
                .stream().map(athleteMaxMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<AthleteMaxResponse> getByExercise(Long athleteId, Long exerciseId, String coachEmail) {
        requireOwnedAthlete(athleteId, coachEmail);
        return athleteMaxRepository.findByAthleteIdAndExerciseIdOrderByRecordedAtDesc(athleteId, exerciseId)
                .stream().map(athleteMaxMapper::toResponse).toList();
    }

    // Returns the latest 1RM for athlete+exercise
    @Transactional(readOnly = true)
    public AthleteMaxResponse getCurrent(Long athleteId, Long exerciseId, String coachEmail) {
        requireOwnedAthlete(athleteId, coachEmail);
        return athleteMaxRepository
                .findFirstByAthleteIdAndExerciseIdOrderByRecordedAtDesc(athleteId, exerciseId)
                .map(athleteMaxMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("AthleteMax", "athlete=" + athleteId + "/exercise=" + exerciseId));
    }

    public AthleteMaxResponse record(Long athleteId, AthleteMaxRequest request, String coachEmail) {
        Athlete athlete = requireOwnedAthlete(athleteId, coachEmail);
        Exercise exercise = exerciseRepository.findById(request.exerciseId())
                .orElseThrow(() -> new ResourceNotFoundException("Exercise", request.exerciseId()));

        AthleteMax max = AthleteMax.builder()
                .athlete(athlete)
                .exercise(exercise)
                .maxWeight(request.maxWeight())
                .recordedAt(request.recordedAt() != null ? request.recordedAt() : LocalDate.now())
                .build();

        return athleteMaxMapper.toResponse(athleteMaxRepository.save(max));
    }

    public void delete(Long id, String coachEmail) {
        AthleteMax max = athleteMaxRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AthleteMax", id));
        if (!max.getAthlete().getCoach().getEmail().equals(coachEmail)) {
            throw new ForbiddenException();
        }
        athleteMaxRepository.deleteById(id);
    }

    // P = (weight / 1RM) × 100
    @Transactional(readOnly = true)
    public double calculatePercentageOfMax(Long athleteId, Long exerciseId, Double weight) {
        return athleteMaxRepository
                .findFirstByAthleteIdAndExerciseIdOrderByRecordedAtDesc(athleteId, exerciseId)
                .map(max -> round2(weight / max.getMaxWeight() * 100))
                .orElse(0.0);
    }

    private Athlete requireOwnedAthlete(Long athleteId, String coachEmail) {
        Athlete athlete = athleteRepository.findById(athleteId)
                .orElseThrow(() -> new ResourceNotFoundException("Athlete", athleteId));
        if (!athlete.getCoach().getEmail().equals(coachEmail)) {
            throw new ForbiddenException();
        }
        return athlete;
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
