package com.catijr.backend_java.dto;

public record UpdateTaskDTO(String taskName, String description, String priority, 
                            String expectedFinishDate, String listId, String finishDate) {

}
