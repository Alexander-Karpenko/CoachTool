package com.CoachTool.repository;

import com.CoachTool.entity.AthleteMax;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AthleteMaxRepository extends JpaRepository<AthleteMax, Long> {

    List<AthleteMax> findByAthleteIdOrderByRecordedAtDesc(Long athleteId);

    List<AthleteMax> findByAthleteIdAndExerciseIdOrderByRecordedAtDesc(Long athleteId, Long exerciseId);

    Optional<AthleteMax> findFirstByAthleteIdAndExerciseIdOrderByRecordedAtDesc(Long athleteId, Long exerciseId);

    @Query("""
            SELECT am FROM AthleteMax am
            JOIN FETCH am.exercise
            WHERE am.athlete.id = :athleteId
              AND am.exercise.id = :exerciseId
              AND am.recordedAt BETWEEN :from AND :to
            ORDER BY am.recordedAt ASC
            """)
    List<AthleteMax> findByAthleteIdAndExerciseIdAndPeriod(@Param("athleteId") Long athleteId,
                                                            @Param("exerciseId") Long exerciseId,
                                                            @Param("from") LocalDate from,
                                                            @Param("to") LocalDate to);
}
