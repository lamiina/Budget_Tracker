package com.App.Tracker.Exceptions;

import org.springframework.http.HttpStatus;

public class HttpException extends RuntimeException {
    HttpStatus status;

    public HttpException (String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus () {
        return status;
    }
}

