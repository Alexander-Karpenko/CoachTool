package com.coachtool.app.service.impl;

import com.coachtool.app.service.CellService;
import com.coachtool.app.repository.CellRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CellServiceImpl implements CellService {
    private final CellRepository cellRepository;

}
