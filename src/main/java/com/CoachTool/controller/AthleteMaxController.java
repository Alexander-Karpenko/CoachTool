package com.CoachTool.controller;

import com.CoachTool.dto.max.AthleteMaxRequest;
import com.CoachTool.dto.max.AthleteMaxResponse;
import com.CoachTool.service.AthleteMaxService;
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
@RequestMapping("/api/athletes/{athleteId}/maxes")
@RequiredArgsConstructor
@PreAuthorize("hasRole('COACH')")
public class AthleteMaxController {

    private final AthleteMaxService athleteMaxService;

    @GetMapping
    public ResponseEntity<List<AthleteMaxResponse>> getAll(@PathVariable Long athleteId,
                                                            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(athleteMaxService.getAllByAthlete(athleteId, principal.getUsername()));
    }

    @GetMapping("/exercise/{exerciseId}")
    public ResponseEntity<List<AthleteMaxResponse>> getByExercise(@PathVariable Long athleteId,
                                                                    @PathVariable Long exerciseId,
                                                                    @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(athleteMaxService.getByExercise(athleteId, exerciseId, principal.getUsername()));
    }

    @GetMapping("/exercise/{exerciseId}/current")
    public ResponseEntity<AthleteMaxResponse> getCurrent(@PathVariable Long athleteId,
                                                          @PathVariable Long exerciseId,
                                                          @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(athleteMaxService.getCurrent(athleteId, exerciseId, principal.getUsername()));
    }

    @PostMapping
    public ResponseEntity<AthleteMaxResponse> record(@PathVariable Long athleteId,
                                                      @Valid @RequestBody AthleteMaxRequest request,
                                                      @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(athleteMaxService.record(athleteId, request, principal.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long athleteId,
                                        @PathVariable Long id,
                                        @AuthenticationPrincipal UserDetails principal) {
        athleteMaxService.delete(id, principal.getUsername());
        return ResponseEntity.noContent().build();
    }

    // Utility: calculate %1RM for a given weight
    @GetMapping("/exercise/{exerciseId}/percentage")
    public ResponseEntity<Double> calculatePercentage(@PathVariable Long athleteId,
                                                       @PathVariable Long exerciseId,
                                                       @RequestParam Double weight,
                                                       @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(athleteMaxService.calculatePercentageOfMax(athleteId, exerciseId, weight));
    }
}
