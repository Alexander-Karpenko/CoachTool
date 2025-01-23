package com.coachtool.app.domain.mapper.trainingPlan;

import com.coachtool.app.domain.dto.trainingPlan.TrainingPlanDTO;
import com.coachtool.app.domain.entity.TrainingPlan;
import com.coachtool.app.domain.mapper.EntityMapper;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TrainingPlanMapper extends EntityMapper<TrainingPlanDTO, TrainingPlan> {
    @Override
    TrainingPlan toEntity(TrainingPlanDTO dto);

    @Override
    TrainingPlanDTO toDto(TrainingPlan entity);

    @Override
    List<TrainingPlan> toEntity(List<TrainingPlanDTO> dtoList);

    @Override
    List<TrainingPlanDTO> toDto(List<TrainingPlan> entityList);
}
