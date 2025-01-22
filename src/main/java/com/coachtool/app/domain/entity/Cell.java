package com.coachtool.app.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "cell")
public class Cell {
    @Id
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_training_plan")
    private TrainingPlan trainingPlan;

    @Column(name = "date")
    private Date date;

    @Column(name = "column_position")
    @Min(0)
    @Max(30)
    private int columnPosition;

    @ManyToOne
    @JoinColumn(name = "exerciseType_id", referencedColumnName = "id")
    private ExerciseType exerciseType;

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

    @Column(name = "exercise_progress")
    @Min(0)
    @Max(1)
    private double exerciseProgress;

    @Column(name = "comment")
    @Size(max = 100)
    private String comment;

}
