package com.coachtool.app.services;

import com.coachtool.app.domain.dto.CoachDTO;
import com.coachtool.app.domain.entity.Coach;
import com.coachtool.app.repositories.CoachesRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CoachesService {

    private final CoachesRepository coachesRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public CoachesService(CoachesRepository coachesRepository, ModelMapper modelMapper) {
        this.coachesRepository = coachesRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional
    public void save(Coach coach){
        coachesRepository.save(coach);
    }

    public Optional<Coach> findByPhoneNumber(String phoneNumber){
       return coachesRepository.findByPhoneNumber(phoneNumber);
    }
    public Coach convertToCoach(CoachDTO coachDTO){
        return modelMapper.map(coachDTO, Coach.class);
    }

}
