package com.CoachTool.mapper;

import com.CoachTool.dto.max.AthleteMaxResponse;
import com.CoachTool.entity.AthleteMax;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AthleteMaxMapper {

    @Mapping(target = "athleteId",    source = "athlete.id")
    @Mapping(target = "exerciseId",   source = "exercise.id")
    @Mapping(target = "exerciseName", source = "exercise.name")
    @Mapping(target = "muscleGroup",  source = "exercise.muscleGroup")
    AthleteMaxResponse toResponse(AthleteMax athleteMax);
}
