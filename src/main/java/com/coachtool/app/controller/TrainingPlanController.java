package com.coachtool.app.controller;

import com.coachtool.app.service.impl.TrainingPlanServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TrainingPlanController {
    private final TrainingPlanServiceImpl trainingPlanService;

    @Autowired
    public TrainingPlanController(TrainingPlanServiceImpl trainingPlanService) {
        this.trainingPlanService = trainingPlanService;
    }
}
