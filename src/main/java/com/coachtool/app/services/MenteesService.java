package com.coachtool.app.services;

import com.coachtool.app.repositories.MenteesRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MenteesService {

    private final MenteesRepository menteesRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public MenteesService(MenteesRepository menteesRepository, ModelMapper modelMapper) {
        this.menteesRepository = menteesRepository;
        this.modelMapper = modelMapper;
    }


}
