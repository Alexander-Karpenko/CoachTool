package com.coachtool.app.domain.dto.coachMentee;

import com.coachtool.app.domain.dto.user.UserDTO;
import com.coachtool.app.domain.entity.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Data
public class CoachMenteeDTO {
    private Long id;

    private UserDTO coach;

    private UserDTO mentee;
}
