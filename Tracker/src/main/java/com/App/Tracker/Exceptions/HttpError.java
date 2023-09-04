package com.App.Tracker.Exceptions;

public class HttpError {
    int status;
    String message;

    public HttpError(String message, int status) {
        this.message = message;
        this.status = status;
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}