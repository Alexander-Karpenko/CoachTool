package com.coachtool.app.repository;

import com.coachtool.app.domain.entity.CoachMentee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoachMenteeRepository extends JpaRepository<CoachMentee, Long> {
}
