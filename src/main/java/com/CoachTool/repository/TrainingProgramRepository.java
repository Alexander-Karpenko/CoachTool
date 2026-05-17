package com.CoachTool.repository;

import com.CoachTool.entity.TrainingProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TrainingProgramRepository extends JpaRepository<TrainingProgram, Long> {

    List<TrainingProgram> findByAthleteId(Long athleteId);

    List<TrainingProgram> findByCoachId(Long coachId);

    @Query("""
            SELECT tp FROM TrainingProgram tp
            WHERE tp.athlete.id = :athleteId
            ORDER BY tp.weekStartDate DESC
            """)
    List<TrainingProgram> findByAthleteIdOrderByWeekStartDateDesc(@Param("athleteId") Long athleteId);

    @Query("""
            SELECT tp FROM TrainingProgram tp
            WHERE tp.coach.id = :coachId
              AND tp.athlete.id = :athleteId
            ORDER BY tp.weekStartDate DESC
            """)
    List<TrainingProgram> findByCoachIdAndAthleteId(@Param("coachId") Long coachId,
                                                    @Param("athleteId") Long athleteId);

    // JOIN FETCH prevents N+1 when iterating exercises during analytics
    @Query("""
            SELECT DISTINCT tp FROM TrainingProgram tp
            LEFT JOIN FETCH tp.exercises te
            LEFT JOIN FETCH te.exercise
            WHERE tp.athlete.id = :athleteId
              AND tp.coach.id  = :coachId
              AND tp.weekStartDate >= :from
              AND tp.weekStartDate <= :to
            ORDER BY tp.weekStartDate ASC
            """)
    List<TrainingProgram> findForAnalytics(@Param("athleteId") Long athleteId,
                                           @Param("coachId") Long coachId,
                                           @Param("from") LocalDate from,
                                           @Param("to") LocalDate to);
}
