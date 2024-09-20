package com.coachtool.app.util;

import com.coachtool.app.domain.entity.Coach;
import com.coachtool.app.services.CoachesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

@Component
public class CoachValidator implements Validator {
    private final CoachesService coachesService;

    @Autowired
    public CoachValidator(CoachesService coachesService) {
        this.coachesService = coachesService;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return Coach.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        Coach coach = (Coach) target;
        if(coachesService.findByPhoneNumber(coach.getPhoneNumber()).isPresent()){
            errors.rejectValue("phone number", "", "Phone number already taken");
        }
    }
}
