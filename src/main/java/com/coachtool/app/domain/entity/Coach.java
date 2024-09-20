package com.coachtool.app.domain.entity;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "coach")
@Component
public class Coach {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID id;

    @Column(name = "name")
    @NotEmpty(message = "name should not be empty")
    private String name;

    @Column(name = "middle_name")
    @NotEmpty(message = "middle name should not be empty")
    private String middleName;

    @Column(name = "surname")
    @NotEmpty(message = "surname should not be empty")
    private String surname;

    @Column(name = "password")
    @NotEmpty(message = "password should not be empty")
    private String password;

    @Column(name = "date_of_birth")
    @NotEmpty(message = "date of birth should not be empty")
    @DateTimeFormat(pattern = "dd.mm.yyyy")
    private Date dateOfBirth;

    @Column(name = "phone_number")
    @NotEmpty(message = "phone number should not be empty")
    @Size(min = 11, max = 11)
    private String phoneNumber;

    @NotEmpty(message = "sport type number should not be empty")
    @Column(name = "sport_type")
    private String sportType;

    @Column(name = "sport_title")
    private String sportTitle;

    @OneToMany(mappedBy = "menteesCoach")
    private List<Mentee> mentees;

}
