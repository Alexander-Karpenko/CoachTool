package com.CoachTool.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "athlete_maxes",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_athlete_exercise_date",
                columnNames = {"athlete_id", "exercise_id", "recorded_at"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"athlete", "exercise"})
public class AthleteMax {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "athlete_id", nullable = false)
    private Athlete athlete;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @NotNull
    @DecimalMin("0.0")
    @Column(nullable = false)
    private Double maxWeight;

    @NotNull
    @Column(nullable = false)
    private LocalDate recordedAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (recordedAt == null) recordedAt = LocalDate.now();
    }
}
