package com.coachtool.app.domain.dto.role;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class RoleDTO {
    private Long id;

    private String name;
}
