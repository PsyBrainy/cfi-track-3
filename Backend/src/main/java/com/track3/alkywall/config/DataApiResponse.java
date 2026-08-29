package com.track3.alkywall.config;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DataApiResponse<T> extends ApiResponse{
    private T data;

    public DataApiResponse(boolean success, String message, T data){
        super(success, message);
        this.data = data;
    }
}
