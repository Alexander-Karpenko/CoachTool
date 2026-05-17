package com.CoachTool.service;

import com.CoachTool.dto.training.TrainingExerciseRequest;
import com.CoachTool.dto.training.TrainingProgramRequest;
import com.CoachTool.dto.training.TrainingProgramResponse;
import com.CoachTool.entity.Athlete;
import com.CoachTool.entity.Exercise;
import com.CoachTool.entity.TrainingExercise;
import com.CoachTool.entity.TrainingProgram;
import com.CoachTool.entity.User;
import com.CoachTool.exception.ForbiddenException;
import com.CoachTool.exception.ResourceNotFoundException;
import com.CoachTool.mapper.TrainingExerciseMapper;
import com.CoachTool.mapper.TrainingProgramMapper;
import com.CoachTool.repository.AthleteRepository;
import com.CoachTool.repository.ExerciseRepository;
import com.CoachTool.repository.TrainingProgramRepository;
import com.CoachTool.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TrainingProgramService {

    private final TrainingProgramRepository trainingProgramRepository;
    private final AthleteRepository athleteRepository;
    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;
    private final TrainingProgramMapper trainingProgramMapper;
    private final TrainingExerciseMapper trainingExerciseMapper;

    @Transactional(readOnly = true)
    public List<TrainingProgramResponse> getAllByCoach(String coachEmail) {
        User coach = requireUser(coachEmail);
        return trainingProgramRepository.findByCoachId(coach.getId())
                .stream().map(trainingProgramMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<TrainingProgramResponse> getAllByAthlete(Long athleteId, String coachEmail) {
        requireOwnedAthlete(athleteId, coachEmail);
        return trainingProgramRepository.findByAthleteIdOrderByWeekStartDateDesc(athleteId)
                .stream().map(trainingProgramMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public TrainingProgramResponse getById(Long id, String coachEmail) {
        return trainingProgramMapper.toResponse(requireOwned(id, coachEmail));
    }

    public TrainingProgramResponse create(TrainingProgramRequest request, String coachEmail) {
        User coach = requireUser(coachEmail);
        Athlete athlete = requireOwnedAthlete(request.athleteId(), coachEmail);

        TrainingProgram program = trainingProgramMapper.toEntity(request);
        program.setCoach(coach);
        program.setAthlete(athlete);
        program.setExercises(buildExercises(request.exercises(), program));

        return trainingProgramMapper.toResponse(trainingProgramRepository.save(program));
    }

    public TrainingProgramResponse update(Long id, TrainingProgramRequest request, String coachEmail) {
        TrainingProgram program = requireOwned(id, coachEmail);

        program.setTitle(request.title());
        program.setWeekStartDate(request.weekStartDate());
        program.setNotes(request.notes());

        // orphanRemoval = true: clearing replaces the old exercises on flush
        program.getExercises().clear();
        program.getExercises().addAll(buildExercises(request.exercises(), program));

        return trainingProgramMapper.toResponse(trainingProgramRepository.save(program));
    }

    public void delete(Long id, String coachEmail) {
        requireOwned(id, coachEmail);
        trainingProgramRepository.deleteById(id);
    }

    public TrainingProgramResponse copyToNextWeek(Long id, String coachEmail) {
        TrainingProgram source = requireOwned(id, coachEmail);

        LocalDate nextWeekStart = source.getWeekStartDate() != null
                ? source.getWeekStartDate().plusWeeks(1)
                : LocalDate.now().plusWeeks(1);

        TrainingProgram copy = TrainingProgram.builder()
                .title(source.getTitle())
                .notes(source.getNotes())
                .weekStartDate(nextWeekStart)
                .athlete(source.getAthlete())
                .coach(source.getCoach())
                .build();

        source.getExercises().forEach(ex -> {
            TrainingExercise newEx = TrainingExercise.builder()
                    .sets(ex.getSets())
                    .reps(ex.getReps())
                    .weight(ex.getWeight())
                    .percentageOfMax(ex.getPercentageOfMax())
                    .comments(ex.getComments())
                    .orderIndex(ex.getOrderIndex())
                    .dayOfWeek(ex.getDayOfWeek())
                    .exercise(ex.getExercise())
                    .trainingProgram(copy)
                    .build();
            copy.getExercises().add(newEx);
        });

        return trainingProgramMapper.toResponse(trainingProgramRepository.save(copy));
    }

    private List<TrainingExercise> buildExercises(List<TrainingExerciseRequest> requests,
                                                   TrainingProgram program) {
        if (requests == null) return new ArrayList<>();
        return requests.stream().map(req -> {
            Exercise exercise = exerciseRepository.findById(req.exerciseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Exercise", req.exerciseId()));
            TrainingExercise te = trainingExerciseMapper.toEntity(req);
            te.setExercise(exercise);
            te.setTrainingProgram(program);
            return te;
        }).toList();
    }

    private User requireUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", email));
    }

    private Athlete requireOwnedAthlete(Long athleteId, String coachEmail) {
        Athlete athlete = athleteRepository.findById(athleteId)
                .orElseThrow(() -> new ResourceNotFoundException("Athlete", athleteId));
        if (!athlete.getCoach().getEmail().equals(coachEmail)) {
            throw new ForbiddenException();
        }
        return athlete;
    }

    private TrainingProgram requireOwned(Long id, String coachEmail) {
        TrainingProgram program = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TrainingProgram", id));
        if (!program.getCoach().getEmail().equals(coachEmail)) {
            throw new ForbiddenException();
        }
        return program;
    }
}
