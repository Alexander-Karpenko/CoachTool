package com.coachtool.app.controller;

import com.coachtool.app.service.impl.CellServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CellController {
    private final CellServiceImpl cellService;

    @Autowired
    public CellController(CellServiceImpl cellService) {
        this.cellService = cellService;
    }
}
