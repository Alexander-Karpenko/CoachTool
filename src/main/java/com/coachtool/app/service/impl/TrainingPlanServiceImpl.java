package com.coachtool.app.service.impl;

import com.coachtool.app.service.TrainingPlanService;
import com.coachtool.app.repository.TrainingPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrainingPlanServiceImpl implements TrainingPlanService {
    private final TrainingPlanRepository trainingPlanRepository;

}
