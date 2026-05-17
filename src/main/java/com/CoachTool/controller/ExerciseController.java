package com.CoachTool.controller;

import com.CoachTool.dto.exercise.ExerciseRequest;
import com.CoachTool.dto.exercise.ExerciseResponse;
import com.CoachTool.entity.enums.ExerciseType;
import com.CoachTool.entity.enums.MuscleGroup;
import com.CoachTool.service.ExerciseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    // Reading the exercise library is open to any authenticated user
    @GetMapping
    public ResponseEntity<List<ExerciseResponse>> getAll(
            @RequestParam(required = false) MuscleGroup muscleGroup,
            @RequestParam(required = false) ExerciseType exerciseType) {

        if (muscleGroup != null) {
            return ResponseEntity.ok(exerciseService.getByMuscleGroup(muscleGroup));
        }
        if (exerciseType != null) {
            return ResponseEntity.ok(exerciseService.getByType(exerciseType));
        }
        return ResponseEntity.ok(exerciseService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExerciseResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(exerciseService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('COACH')")
    public ResponseEntity<ExerciseResponse> create(@Valid @RequestBody ExerciseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(exerciseService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COACH')")
    public ResponseEntity<ExerciseResponse> update(@PathVariable Long id,
                                                    @Valid @RequestBody ExerciseRequest request) {
        return ResponseEntity.ok(exerciseService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COACH')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        exerciseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
