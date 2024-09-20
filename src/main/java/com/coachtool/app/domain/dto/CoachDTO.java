package com.coachtool.app.domain.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

public class CoachDTO {
    @NotEmpty(message = "name should not be empty")
    private String name;

    @NotEmpty(message = "middle name should not be empty")
    private String middleName;

    @NotEmpty(message = "surname should not be empty")
    private String surname;

    @NotEmpty(message = "password should not be empty")
    private String password;

    @NotEmpty(message = "date of birth should not be empty")
    @DateTimeFormat(pattern = "dd.mm.yyyy")
    private Date dateOfBirth;

    @NotEmpty(message = "phone number should not be empty")
    @Size(min = 11, max = 11)
    private String phoneNumber;

    @NotEmpty(message = "sport type number should not be empty")
    private String sportType;

    private String sportTitle;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Date getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getSportType() {
        return sportType;
    }

    public void setSportType(String sportType) {
        this.sportType = sportType;
    }

    public String getSportTitle() {
        return sportTitle;
    }

    public void setSportTitle(String sportTitle) {
        this.sportTitle = sportTitle;
    }

    @Override
    public String toString() {
        return "CoachDTO{" +
                "name='" + name + '\'' +
                ", middleName='" + middleName + '\'' +
                ", surname='" + surname + '\'' +
                ", password='" + password + '\'' +
                ", dateOfBirth=" + dateOfBirth +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", sportType='" + sportType + '\'' +
                ", sportTitle='" + sportTitle + '\'' +
                '}';
    }
}
