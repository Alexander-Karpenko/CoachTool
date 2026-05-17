package com.CoachTool.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String entity, Object id) {
        super(entity + " not found: " + id);
    }
}
