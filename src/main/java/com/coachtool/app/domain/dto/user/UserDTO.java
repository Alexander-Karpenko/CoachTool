package com.coachtool.app.domain.dto.user;

import com.coachtool.app.domain.dto.role.RoleDTO;
import lombok.Data;

import java.util.Date;

@Data
public class UserDTO {
    private Long id;

    private String name;

    private String middleName;

    private String surname;

    private String password;

    private String email;

    private Date dateOfBirth;

    private RoleDTO role;
}
