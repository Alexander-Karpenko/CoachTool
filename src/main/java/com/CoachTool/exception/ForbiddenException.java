package com.CoachTool.exception;

public class ForbiddenException extends RuntimeException {
    public ForbiddenException() {
        super("Access denied");
    }
}
