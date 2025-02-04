package com.coachtool.app.service.impl;

import com.coachtool.app.service.CoachMenteeService;
import com.coachtool.app.repository.CoachMenteeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CoachMenteeServiceImpl implements CoachMenteeService {
    private final CoachMenteeRepository coachMenteeRepository;

}
