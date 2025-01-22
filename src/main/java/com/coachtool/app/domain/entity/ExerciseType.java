package com.coachtool.app.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "exercise_type")
public class ExerciseType {
    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "exercise_name")
    private String exerciseName;

    @OneToMany(mappedBy = "exerciseType",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    @JsonIgnore
    private List<Cell> Cells;

}
