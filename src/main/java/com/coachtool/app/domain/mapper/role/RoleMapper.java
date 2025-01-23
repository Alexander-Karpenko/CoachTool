package com.coachtool.app.domain.mapper.role;

import com.coachtool.app.domain.dto.role.RoleDTO;
import com.coachtool.app.domain.entity.Role;
import com.coachtool.app.domain.mapper.EntityMapper;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RoleMapper extends EntityMapper<RoleDTO, Role> {
    @Override
    Role toEntity(RoleDTO dto);

    @Override
    RoleDTO toDto(Role entity);

    @Override
    List<Role> toEntity(List<RoleDTO> dtoList);

    @Override
    List<RoleDTO> toDto(List<Role> entityList);
}
