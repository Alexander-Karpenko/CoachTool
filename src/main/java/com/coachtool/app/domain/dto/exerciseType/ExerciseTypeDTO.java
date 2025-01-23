package com.coachtool.app.domain.dto.exerciseType;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class ExerciseTypeDTO {
    private Long id;

    private String exerciseName;
}
