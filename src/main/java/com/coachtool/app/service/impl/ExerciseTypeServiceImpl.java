package com.coachtool.app.service.impl;

import com.coachtool.app.service.ExerciseTypeService;
import com.coachtool.app.repository.ExerciseTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExerciseTypeServiceImpl implements ExerciseTypeService {
    private final ExerciseTypeRepository exerciseTypeRepository;

}
