package com.CoachTool.controller;

import com.CoachTool.dto.training.TrainingProgramRequest;
import com.CoachTool.dto.training.TrainingProgramResponse;
import com.CoachTool.service.TrainingProgramService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/training-programs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('COACH')")
public class TrainingProgramController {

    private final TrainingProgramService trainingProgramService;

    @GetMapping
    public ResponseEntity<List<TrainingProgramResponse>> getAll(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(trainingProgramService.getAllByCoach(principal.getUsername()));
    }

    @GetMapping("/athlete/{athleteId}")
    public ResponseEntity<List<TrainingProgramResponse>> getByAthlete(
            @PathVariable Long athleteId,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(trainingProgramService.getAllByAthlete(athleteId, principal.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainingProgramResponse> getById(@PathVariable Long id,
                                                            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(trainingProgramService.getById(id, principal.getUsername()));
    }

    @PostMapping
    public ResponseEntity<TrainingProgramResponse> create(@Valid @RequestBody TrainingProgramRequest request,
                                                           @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(trainingProgramService.create(request, principal.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainingProgramResponse> update(@PathVariable Long id,
                                                           @Valid @RequestBody TrainingProgramRequest request,
                                                           @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(trainingProgramService.update(id, request, principal.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                        @AuthenticationPrincipal UserDetails principal) {
        trainingProgramService.delete(id, principal.getUsername());
        return ResponseEntity.noContent().build();
    }
}
