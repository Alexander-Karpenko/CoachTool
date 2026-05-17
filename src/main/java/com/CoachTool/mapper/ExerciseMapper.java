package com.CoachTool.mapper;

import com.CoachTool.dto.exercise.ExerciseRequest;
import com.CoachTool.dto.exercise.ExerciseResponse;
import com.CoachTool.entity.Exercise;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ExerciseMapper {

    ExerciseResponse toResponse(Exercise exercise);

    @Mapping(target = "id", ignore = true)
    Exercise toEntity(ExerciseRequest request);

    @Mapping(target = "id", ignore = true)
    void updateEntity(ExerciseRequest request, @MappingTarget Exercise exercise);
}
