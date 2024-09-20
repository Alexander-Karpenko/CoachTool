package com.coachtool.app.controllers;

import com.coachtool.app.domain.dto.CoachDTO;
import com.coachtool.app.domain.entity.Coach;
import com.coachtool.app.services.CoachesService;
import com.coachtool.app.util.CoachValidator;
import com.coachtool.app.util.ErrorsOut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/coaches")
public class CoachesController {
    private final CoachesService coachesService;
    private final CoachValidator coachValidator;

    @Autowired
    public CoachesController(CoachesService coachesService, CoachValidator coachValidator) {
        this.coachesService = coachesService;
        this.coachValidator = coachValidator;
    }

    @RequestMapping("/auth")
    @PostMapping()
    public ResponseEntity<HttpStatus> auth(@RequestBody CoachDTO coachDTO, BindingResult bindingResult){
        Coach coach = coachesService.convertToCoach(coachDTO);
        coachValidator.validate(coach, bindingResult);
        if (bindingResult.hasErrors()){
            ErrorsOut.returnErrorsToClient(bindingResult);
        }
        coachesService.save(coach);
        return ResponseEntity.ok(HttpStatus.OK);
    }

}
