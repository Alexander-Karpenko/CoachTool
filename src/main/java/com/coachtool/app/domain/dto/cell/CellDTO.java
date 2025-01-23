package com.coachtool.app.domain.dto.cell;

import com.coachtool.app.domain.dto.exerciseType.ExerciseTypeDTO;
import com.coachtool.app.domain.entity.ExerciseType;
import com.coachtool.app.domain.entity.TrainingPlan;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Date;

@Data
public class CellDTO {
    private Long id;

    private Date date;

    private int columnPosition;

    private ExerciseTypeDTO exerciseType;

    private int weight;

    private int reps;

    private int sets;

    private double exerciseProgress;

    private String comment;
}
