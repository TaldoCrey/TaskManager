package com.catijr.backend_java.dto;

import java.util.UUID;

import com.catijr.backend_java.Enums.Priority;

public record TaskResponseDTO(UUID taskId, String taskName, String description, Priority priority, 
                                String expectedFinishDate, String finishDate, UUID listId) {

}
