package com.coachtool.app.domain.mapper.exerciseType;

import com.coachtool.app.domain.dto.exerciseType.ExerciseTypeDTO;
import com.coachtool.app.domain.entity.ExerciseType;
import com.coachtool.app.domain.mapper.EntityMapper;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ExerciseTypeMapper extends EntityMapper<ExerciseTypeDTO, ExerciseType> {
    @Override
    ExerciseType toEntity(ExerciseTypeDTO dto);

    @Override
    ExerciseTypeDTO toDto(ExerciseType entity);

    @Override
    List<ExerciseType> toEntity(List<ExerciseTypeDTO> dtoList);

    @Override
    List<ExerciseTypeDTO> toDto(List<ExerciseType> entityList);
}
