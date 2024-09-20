package com.coachtool.app.repositories;

import com.coachtool.app.domain.entity.Mentee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MenteesRepository extends JpaRepository<Mentee, Integer> {

}
