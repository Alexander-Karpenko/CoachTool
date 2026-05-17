package com.CoachTool.dto.training;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record TrainingProgramResponse(
        Long id,
        String title,
        LocalDate weekStartDate,
        String notes,
        LocalDateTime createdAt,
        Long athleteId,
        String athleteFirstName,
        String athleteLastName,
        Long coachId,
        List<TrainingExerciseResponse> exercises
) {}
