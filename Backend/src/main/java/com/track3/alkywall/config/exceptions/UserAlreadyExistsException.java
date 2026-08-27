package com.track3.alkywall.config.exceptions;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException() {
        super("El usuario ya existe.");
    }
}
