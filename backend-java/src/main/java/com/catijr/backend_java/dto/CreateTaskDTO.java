package com.catijr.backend_java.dto;

public record CreateTaskDTO(String taskname, String description, 
                            String priority, String expectedFinishDate, String listId) {

}
