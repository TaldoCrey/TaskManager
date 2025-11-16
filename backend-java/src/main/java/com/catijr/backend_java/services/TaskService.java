package com.catijr.backend_java.services;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.catijr.backend_java.Entities.Task;
import com.catijr.backend_java.Enums.Priority;
import com.catijr.backend_java.dto.CreateTaskDTO;
import com.catijr.backend_java.dto.UpdateTaskDTO;
import com.catijr.backend_java.repositories.ListRepository;
import com.catijr.backend_java.repositories.TaskRepository;

@Service
public class TaskService {

    TaskRepository taskRepository;
    ListRepository listRepository;

    public TaskService(TaskRepository taskRepository, ListRepository listRepository) {
        this.taskRepository = taskRepository;
        this.listRepository = listRepository;
    }

    public UUID createTask(CreateTaskDTO createTaskDTO) {
        var list = listRepository.findById(UUID.fromString(createTaskDTO.listId())).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        var task = new Task(
            createTaskDTO.taskname(),
            createTaskDTO.description(),
            Priority.valueOf(createTaskDTO.priority()),
            createTaskDTO.expectedFinishDate(),
            list
        );

        var savedTask = taskRepository.save(task);

        return savedTask.getTaskId();
    }

    public Task getTaskById(String taskId) {
        var task = taskRepository.findById(UUID.fromString(taskId)).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return task;
    }

    public void updateTaskById(String taskId, UpdateTaskDTO updateTaskDTO) {
        var task = taskRepository.findById(UUID.fromString(taskId)).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    
        if (updateTaskDTO.taskName() != null && updateTaskDTO.taskName().trim() != "") {
            task.setTaskName(updateTaskDTO.taskName());
        }

        if (updateTaskDTO.description() != null) {
            task.setDescription(updateTaskDTO.description());
        }

        if (updateTaskDTO.expectedFinishDate() != null) {
            task.setExpectedFinishDate(updateTaskDTO.expectedFinishDate());
        }

        if (updateTaskDTO.priority() != null) {
            task.setPriority(Priority.valueOf(updateTaskDTO.priority()));
        }

        if (updateTaskDTO.finishDate() != null) {
            task.setFinishDate(updateTaskDTO.finishDate());
        }

        if (updateTaskDTO.listId() != null) {
            var list = listRepository.findById(UUID.fromString(updateTaskDTO.listId())).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
            task.setTaskList(list);
        }

        taskRepository.save(task);
    }

    public void deleteTaskById(String taskId) {
        var id = UUID.fromString(taskId);
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }   

}
