package com.coachtool.app.domain.mapper.coachMentee;

import com.coachtool.app.domain.dto.coachMentee.CoachMenteeDTO;
import com.coachtool.app.domain.entity.CoachMentee;
import com.coachtool.app.domain.mapper.EntityMapper;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CoachMenteeMapper extends EntityMapper<CoachMenteeDTO, CoachMentee> {
    @Override
    CoachMentee toEntity(CoachMenteeDTO dto);

    @Override
    CoachMenteeDTO toDto(CoachMentee entity);

    @Override
    List<CoachMentee> toEntity(List<CoachMenteeDTO> dtoList);

    @Override
    List<CoachMenteeDTO> toDto(List<CoachMentee> entityList);
}
