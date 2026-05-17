package com.CoachTool.dto.athlete;

import com.CoachTool.entity.enums.Qualification;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AthleteResponse(
        Long id,
        String firstName,
        String lastName,
        Integer age,
        Double height,
        Double weight,
        Qualification qualification,
        LocalDate trainingStartDate,
        String contactInfo,
        LocalDateTime createdAt,
        Long coachId
) {}
