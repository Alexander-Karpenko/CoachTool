package com.coachtool.app.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "training_plan")
@Component
public class TrainingPlan {
    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "week_begin_date")
    private Date weekBeginDate;

    @ManyToOne
    @JoinColumn(name = "coach_mentee_id", referencedColumnName = "id")
    private CoachMentee coach_mentee;

    @OneToMany(mappedBy = "trainingPlan",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    @JsonIgnore
    private List<Cell> cells;

}
