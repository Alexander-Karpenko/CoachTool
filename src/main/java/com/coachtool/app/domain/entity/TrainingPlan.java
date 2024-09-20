package com.coachtool.app.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "training_plan")
@Component
public class TrainingPlan {
    @Id
    @Column(name = "id")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "coach_id", referencedColumnName = "id")
    private Coach coachId;

    @ManyToOne
    @JoinColumn(name = "id_training_plan_cell", referencedColumnName = "id")
    private Mentee menteeId;

    @OneToMany(mappedBy = "trainingPlan",
            fetch = FetchType.LAZY,
            cascade = CascadeType.REMOVE,
            orphanRemoval = true)
    @JsonIgnore
    private List<Cell> cells;

}
