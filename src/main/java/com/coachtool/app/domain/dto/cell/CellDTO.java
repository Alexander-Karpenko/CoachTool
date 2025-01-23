package com.coachtool.app.domain.dto.cell;

import com.coachtool.app.domain.dto.exerciseType.ExerciseTypeDTO;
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
