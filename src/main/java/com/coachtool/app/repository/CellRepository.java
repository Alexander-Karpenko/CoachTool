package com.coachtool.app.repository;

import com.coachtool.app.domain.entity.Cell;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CellRepository extends JpaRepository<Cell, Long> {
}
