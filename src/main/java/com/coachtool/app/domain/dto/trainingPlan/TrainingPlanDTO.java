package com.coachtool.app.domain.dto.trainingPlan;

import com.coachtool.app.domain.entity.Cell;
import com.coachtool.app.domain.entity.CoachMentee;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class TrainingPlanDTO {
    private Long id;

    private Date weekBeginDate;

    private CoachMentee coach_mentee;

    private List<Cell> cells;
}
