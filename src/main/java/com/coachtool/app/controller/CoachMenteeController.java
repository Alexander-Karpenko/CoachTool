package com.coachtool.app.controller;

import com.coachtool.app.service.impl.CoachMenteeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CoachMenteeController {
    private final CoachMenteeServiceImpl coachMenteeServiceImpl;

    @Autowired
    public CoachMenteeController(CoachMenteeServiceImpl coachMenteeServiceImpl) {
        this.coachMenteeServiceImpl = coachMenteeServiceImpl;
    }
}
