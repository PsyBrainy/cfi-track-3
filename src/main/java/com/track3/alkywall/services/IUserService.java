package com.track3.alkywall.services;

import com.track3.alkywall.dtos.UserRegisterDTO;
import com.track3.alkywall.dtos.UserResponseDTO;

public interface IUserService {
    UserResponseDTO register(UserRegisterDTO registerDTO);
}
