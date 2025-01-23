package com.coachtool.app.domain.dto.user;

import com.coachtool.app.domain.entity.CoachMentee;
import com.coachtool.app.domain.entity.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Data
public class UserDTO {
    private Long id;

    private String name;

    private String middleName;

    private String surname;

    private String password;

    private String email;

    private Date dateOfBirth;

    private Role role;
}
