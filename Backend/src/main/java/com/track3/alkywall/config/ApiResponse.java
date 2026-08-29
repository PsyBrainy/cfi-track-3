package com.track3.alkywall.config;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class ApiResponse{
        protected boolean success;
        protected String message;
}
