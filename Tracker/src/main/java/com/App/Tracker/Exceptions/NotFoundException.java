package com.App.Tracker.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NotFoundException extends HttpException{
  public NotFoundException(){
      super("Not found", HttpStatus.NOT_FOUND);
  }

    public NotFoundException(String message) {
        super("Not found" + message, HttpStatus.NOT_FOUND);

    }

}
