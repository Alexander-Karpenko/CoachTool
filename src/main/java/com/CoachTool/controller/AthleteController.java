package com.CoachTool.controller;

import com.CoachTool.dto.athlete.AthleteRequest;
import com.CoachTool.dto.athlete.AthleteResponse;
import com.CoachTool.service.AthleteService;
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
@RequestMapping("/api/athletes")
@RequiredArgsConstructor
@PreAuthorize("hasRole('COACH')")
public class AthleteController {

    private final AthleteService athleteService;

    @GetMapping
    public ResponseEntity<List<AthleteResponse>> getAll(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(athleteService.getAllByCoach(principal.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AthleteResponse> getById(@PathVariable Long id,
                                                    @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(athleteService.getById(id, principal.getUsername()));
    }

    @PostMapping
    public ResponseEntity<AthleteResponse> create(@Valid @RequestBody AthleteRequest request,
                                                   @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(athleteService.create(request, principal.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AthleteResponse> update(@PathVariable Long id,
                                                   @Valid @RequestBody AthleteRequest request,
                                                   @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(athleteService.update(id, request, principal.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                        @AuthenticationPrincipal UserDetails principal) {
        athleteService.delete(id, principal.getUsername());
        return ResponseEntity.noContent().build();
    }
}
