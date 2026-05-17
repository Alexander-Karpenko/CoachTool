package com.CoachTool.mapper;

import com.CoachTool.dto.athlete.AthleteRequest;
import com.CoachTool.dto.athlete.AthleteResponse;
import com.CoachTool.entity.Athlete;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface AthleteMapper {

    @Mapping(target = "coachId", source = "coach.id")
    AthleteResponse toResponse(Athlete athlete);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "coach", ignore = true)
    @Mapping(target = "trainingPrograms", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Athlete toEntity(AthleteRequest request);

    // Used for PUT: updates mutable fields in-place, ID and relations untouched
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "coach", ignore = true)
    @Mapping(target = "trainingPrograms", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntity(AthleteRequest request, @MappingTarget Athlete athlete);
}
