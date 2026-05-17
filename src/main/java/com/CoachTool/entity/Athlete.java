package com.CoachTool.entity;

import com.CoachTool.entity.enums.Qualification;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "athletes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"coach", "trainingPrograms"})
public class Athlete {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String firstName;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String lastName;

    @Min(0)
    @Max(120)
    @Column(nullable = false)
    private Integer age;

    @DecimalMin("0.0")
    @DecimalMax("300.0")
    private Double height; // cm

    @DecimalMin("0.0")
    @DecimalMax("500.0")
    private Double weight; // kg

    @Enumerated(EnumType.STRING)
    @Column(length = 40)
    private Qualification qualification;

    private LocalDate trainingStartDate;

    @Column(length = 500)
    private String contactInfo;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Owning side of the Coach -> Athlete relation: FK coach_id lives here
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coach_id", nullable = false)
    private User coach;

    // orphanRemoval = true: removing a program from this list deletes it from DB
    @Builder.Default
    @OneToMany(mappedBy = "athlete", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<TrainingProgram> trainingPrograms = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
