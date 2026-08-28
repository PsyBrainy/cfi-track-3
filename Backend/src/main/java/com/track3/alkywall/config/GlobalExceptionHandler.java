package com.track3.alkywall.config;

import com.track3.alkywall.config.exceptions.LoginFailedException;
import com.track3.alkywall.config.exceptions.UserAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiResponse> userAlreadyExistsException(UserAlreadyExistsException exception){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse(
                false,
                exception.getMessage()
        ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<DataApiResponse<Map<String, String>>> methodArgumentNotValidException(MethodArgumentNotValidException exception){
        Map<String, String> errors = new HashMap<>();

        exception.getFieldErrors().forEach(err -> errors.put(
                err.getField(), err.getDefaultMessage()
        ));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new DataApiResponse<>(
                false,
                "Datos inválidos",
                errors
        ));
    }

    @ExceptionHandler(LoginFailedException.class)
    public ResponseEntity<ApiResponse> loginFailedException(LoginFailedException exception){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(
           false,
           exception.getMessage()
        ));
    }
}
