package com.coachtool.app.services;

import com.coachtool.app.repositories.TrainingPlanRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TrainingPlanService {
    private final TrainingPlanRepository trainingPlanRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public TrainingPlanService(TrainingPlanRepository trainingPlanRepository, ModelMapper modelMapper) {
        this.trainingPlanRepository = trainingPlanRepository;
        this.modelMapper = modelMapper;
    }


}
