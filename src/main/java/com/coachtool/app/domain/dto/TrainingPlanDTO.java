package com.coachtool.app.domain.dto;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.util.Date;

public class TrainingPlanDTO {
    @Min(0)
    @Max(6)
    private int dayOfTheWeekNumber;

    @Column(name = "date")
    private Date date;

    @Min(0)
    @Max(20)
    private int columnPosition;

    @Size(min = 3, max = 50)
    private String exerciseType;

    @Min(1)
    @Max(1500)
    private int weight;

    @Min(1)
    @Max(50)
    private int reps;

    @Min(1)
    @Max(50)
    private int sets;

    @Size(max = 100)
    private String comment;
}
