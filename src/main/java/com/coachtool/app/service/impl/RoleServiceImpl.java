package com.coachtool.app.service.impl;

import com.coachtool.app.service.RoleService;
import com.coachtool.app.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    private final RoleRepository roleRepository;

}
