package com.coachtool.app.util;

import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.Collections;
import java.util.List;

public class ErrorsOut {
    public static void returnErrorsToClient(BindingResult bindingResult){
        StringBuilder errMessage = new StringBuilder();
        List<FieldError> errors = Collections.singletonList(bindingResult.getFieldError());
        for (FieldError error: errors){
            errMessage.append(error.getField()).append(" - ").append(error.getDefaultMessage()).append("; ");
        }

        throw new NotCreatedException(errMessage.toString());
    }
}
