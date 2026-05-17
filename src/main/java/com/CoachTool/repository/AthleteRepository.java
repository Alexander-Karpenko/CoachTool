package com.CoachTool.repository;

import com.CoachTool.entity.Athlete;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AthleteRepository extends JpaRepository<Athlete, Long> {

    List<Athlete> findByCoachId(Long coachId);

    @Query("""
            SELECT a FROM Athlete a
            WHERE a.coach.id = :coachId
              AND (LOWER(a.firstName) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(a.lastName)  LIKE LOWER(CONCAT('%', :search, '%')))
            """)
    List<Athlete> searchByCoachIdAndName(@Param("coachId") Long coachId,
                                         @Param("search") String search);
}
