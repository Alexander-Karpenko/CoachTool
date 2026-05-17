package com.CoachTool.dto.athlete;

import com.CoachTool.entity.enums.Qualification;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record AthleteRequest(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotNull @Min(0) @Max(120) Integer age,
        @DecimalMin("0.0") @DecimalMax("300.0") Double height,
        @DecimalMin("0.0") @DecimalMax("500.0") Double weight,
        Qualification qualification,
        LocalDate trainingStartDate,
        String contactInfo
) {}
