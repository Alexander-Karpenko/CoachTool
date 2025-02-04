package com.coachtool.app.domain.dto.coachMentee;

import com.coachtool.app.domain.dto.user.UserDTO;
import lombok.Data;

@Data
public class CoachMenteeDTO {
    private Long id;

    private UserDTO coach;

    private UserDTO mentee;
}
