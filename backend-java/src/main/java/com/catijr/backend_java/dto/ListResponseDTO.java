package com.catijr.backend_java.dto;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.catijr.backend_java.Entities.TaskList;

public record ListResponseDTO(UUID listID, String listName, List<TaskResponseDTO> taskList) {

    public ListResponseDTO(TaskList list) {
        this(
            list.getListId(),
            list.getListName(),
            list.getTasks().stream().map(task -> new TaskResponseDTO(task.getTaskId(), task.getTaskName(), task.getDescription(),
                                                 task.getPriority(), task.getExpectedFinishDate(), task.getFinishDate(), list.getListId())).collect(Collectors.toList())
        );
    }
}
