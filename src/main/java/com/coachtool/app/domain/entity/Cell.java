package com.coachtool.app.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "cell")
@Component
public class Cell {
    @Id
    @Column(name = "id")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "id_training_plan")
    private TrainingPlan trainingPlan;

    @Column(name = "date")
    private Date date;

    @Column(name = "column_position")
    @Min(0)
    @Max(20)
    private int columnPosition;

    @Column(name = "exerciseType")
    @Size(min = 3, max = 50)
    private String exerciseType;

    @Column(name = "weight")
    @Min(1)
    @Max(1500)
    private int weight;

    @Column(name = "reps")
    @Min(1)
    @Max(50)
    private int reps;

    @Column(name = "sets")
    @Min(1)
    @Max(50)
    private int sets;

    @Column(name = "comment")
    @Size(max = 100)
    private String comment;
}
