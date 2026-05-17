package com.CoachTool.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "training_exercises")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"trainingProgram", "exercise"})
public class TrainingExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(1)
    @Max(100)
    private Integer sets;

    @Min(1)
    @Max(10000)
    private Integer reps;

    @DecimalMin("0.0")
    private Double weight;

    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private Double percentageOfMax;

    @Column(length = 500)
    private String comments;

    @NotNull
    @Column(nullable = false)
    private Integer orderIndex;

    // Owning side: FK training_program_id lives in this table
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "training_program_id", nullable = false)
    private TrainingProgram trainingProgram;

    // Owning side: FK exercise_id lives in this table
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;
}
