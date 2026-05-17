package com.CoachTool.mapper;

import com.CoachTool.dto.training.TrainingProgramRequest;
import com.CoachTool.dto.training.TrainingProgramResponse;
import com.CoachTool.entity.TrainingProgram;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = TrainingExerciseMapper.class)
public interface TrainingProgramMapper {

    @Mapping(target = "athleteId",        source = "athlete.id")
    @Mapping(target = "athleteFirstName", source = "athlete.firstName")
    @Mapping(target = "athleteLastName",  source = "athlete.lastName")
    @Mapping(target = "coachId",          source = "coach.id")
    TrainingProgramResponse toResponse(TrainingProgram program);

    // athlete, coach, exercises and createdAt are set in the service layer
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "athlete", ignore = true)
    @Mapping(target = "coach", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "exercises", ignore = true)
    TrainingProgram toEntity(TrainingProgramRequest request);
}
