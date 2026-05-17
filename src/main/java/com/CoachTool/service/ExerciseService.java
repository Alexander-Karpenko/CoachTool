package com.CoachTool.service;

import com.CoachTool.dto.exercise.ExerciseRequest;
import com.CoachTool.dto.exercise.ExerciseResponse;
import com.CoachTool.entity.Exercise;
import com.CoachTool.entity.enums.ExerciseType;
import com.CoachTool.entity.enums.MuscleGroup;
import com.CoachTool.exception.ResourceNotFoundException;
import com.CoachTool.mapper.ExerciseMapper;
import com.CoachTool.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final ExerciseMapper exerciseMapper;

    @Transactional(readOnly = true)
    public List<ExerciseResponse> getAll() {
        return exerciseRepository.findAll().stream()
                .map(exerciseMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ExerciseResponse> getByMuscleGroup(MuscleGroup muscleGroup) {
        return exerciseRepository.findByMuscleGroup(muscleGroup).stream()
                .map(exerciseMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ExerciseResponse> getByType(ExerciseType exerciseType) {
        return exerciseRepository.findByExerciseType(exerciseType).stream()
                .map(exerciseMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ExerciseResponse getById(Long id) {
        return exerciseMapper.toResponse(requireExercise(id));
    }

    public ExerciseResponse create(ExerciseRequest request) {
        if (exerciseRepository.existsByName(request.name())) {
            throw new IllegalArgumentException("Exercise already exists: " + request.name());
        }
        return exerciseMapper.toResponse(exerciseRepository.save(exerciseMapper.toEntity(request)));
    }

    public ExerciseResponse update(Long id, ExerciseRequest request) {
        Exercise exercise = requireExercise(id);
        exerciseMapper.updateEntity(request, exercise);
        return exerciseMapper.toResponse(exerciseRepository.save(exercise));
    }

    public void delete(Long id) {
        requireExercise(id);
        exerciseRepository.deleteById(id);
    }

    private Exercise requireExercise(Long id) {
        return exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise", id));
    }
}
