package com.CoachTool.mapper;

import com.CoachTool.dto.training.TrainingExerciseRequest;
import com.CoachTool.dto.training.TrainingExerciseResponse;
import com.CoachTool.entity.TrainingExercise;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface TrainingExerciseMapper {

    @Mapping(target = "exerciseId",   source = "exercise.id")
    @Mapping(target = "exerciseName", source = "exercise.name")
    @Mapping(target = "muscleGroup",  source = "exercise.muscleGroup")
    @Mapping(target = "exerciseType", source = "exercise.exerciseType")
    @Mapping(target = "loadUnit",     source = "exercise.loadUnit")
    TrainingExerciseResponse toResponse(TrainingExercise trainingExercise);

    // exercise and trainingProgram are resolved in the service layer
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "exercise", ignore = true)
    @Mapping(target = "trainingProgram", ignore = true)
    TrainingExercise toEntity(TrainingExerciseRequest request);
}
