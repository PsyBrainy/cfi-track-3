package com.track3.alkywall.config.exceptions;

public class AccountNotOwnedByUserException extends RuntimeException {
    public AccountNotOwnedByUserException(String message) {
        super(message);
    }
}
