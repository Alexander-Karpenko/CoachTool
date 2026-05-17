package com.CoachTool.service;

import com.CoachTool.dto.athlete.AthleteRequest;
import com.CoachTool.dto.athlete.AthleteResponse;
import com.CoachTool.entity.Athlete;
import com.CoachTool.entity.User;
import com.CoachTool.exception.ForbiddenException;
import com.CoachTool.exception.ResourceNotFoundException;
import com.CoachTool.mapper.AthleteMapper;
import com.CoachTool.repository.AthleteRepository;
import com.CoachTool.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AthleteService {

    private final AthleteRepository athleteRepository;
    private final UserRepository userRepository;
    private final AthleteMapper athleteMapper;

    @Transactional(readOnly = true)
    public List<AthleteResponse> getAllByCoach(String coachEmail) {
        User coach = requireUser(coachEmail);
        return athleteRepository.findByCoachId(coach.getId())
                .stream().map(athleteMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public AthleteResponse getById(Long id, String coachEmail) {
        return athleteMapper.toResponse(requireOwned(id, coachEmail));
    }

    public AthleteResponse create(AthleteRequest request, String coachEmail) {
        User coach = requireUser(coachEmail);
        Athlete athlete = athleteMapper.toEntity(request);
        athlete.setCoach(coach);
        return athleteMapper.toResponse(athleteRepository.save(athlete));
    }

    public AthleteResponse update(Long id, AthleteRequest request, String coachEmail) {
        Athlete athlete = requireOwned(id, coachEmail);
        athleteMapper.updateEntity(request, athlete);
        return athleteMapper.toResponse(athleteRepository.save(athlete));
    }

    public void delete(Long id, String coachEmail) {
        requireOwned(id, coachEmail);
        athleteRepository.deleteById(id);
    }

    private User requireUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", email));
    }

    private Athlete requireOwned(Long id, String coachEmail) {
        Athlete athlete = athleteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Athlete", id));
        if (!athlete.getCoach().getEmail().equals(coachEmail)) {
            throw new ForbiddenException();
        }
        return athlete;
    }
}
