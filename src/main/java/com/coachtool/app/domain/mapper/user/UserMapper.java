package com.coachtool.app.domain.mapper.user;

import com.coachtool.app.domain.dto.user.UserDTO;
import com.coachtool.app.domain.entity.User;
import com.coachtool.app.domain.mapper.EntityMapper;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper extends EntityMapper<UserDTO, User> {
    @Override
    User toEntity(UserDTO dto);

    @Override
    UserDTO toDto(User entity);

    @Override
    List<User> toEntity(List<UserDTO> dtoList);

    @Override
    List<UserDTO> toDto(List<User> entityList);
}
