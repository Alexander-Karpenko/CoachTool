package com.coachtool.app.domain.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignUpRequest {

    @Size(min = 5, max = 50, message = "Username must contain from 5 to 50 characters")
    @NotBlank(message = "Username cannot be empty")
    private String username;

    @NotEmpty(message = "name should not be empty")
    private String name;

    @NotEmpty(message = "middle name should not be empty")
    private String middleName;

    @NotEmpty(message = "surname should not be empty")
    private String surname;

    @Size(min = 5, max = 255, message = "The email address must contain between 5 and 255 characters")
    @NotBlank(message = "Email address cannot be empty")
    private String email;

    @Size(max = 255, message = "Password length must be no more than 255 characters")
    private String password;

    @NotEmpty(message = "date of birth should not be empty")
    @DateTimeFormat(pattern = "dd.mm.yyyy")
    private Date dateOfBirth;
}