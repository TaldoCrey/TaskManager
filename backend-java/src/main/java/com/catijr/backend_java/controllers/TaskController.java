package com.catijr.backend_java.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.catijr.backend_java.dto.CreateTaskDTO;
import com.catijr.backend_java.dto.CreateTaskResponseDTO;
import com.catijr.backend_java.dto.TaskResponseDTO;
import com.catijr.backend_java.dto.UpdateTaskDTO;
import com.catijr.backend_java.services.TaskService;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/v1/tasks")
public class TaskController {

    private TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<CreateTaskResponseDTO> createTask(@RequestBody CreateTaskDTO createTaskDTO) {
        var taskId = taskService.createTask(createTaskDTO);

        var responseDTO = new CreateTaskResponseDTO(taskId);

        return ResponseEntity.created(URI.create("/v1/tasks/" + taskId.toString())).body(responseDTO);
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponseDTO> getTaskById(@PathVariable("taskId") String taskId) {
        var task = taskService.getTaskById(taskId);

        var taskResponse = new TaskResponseDTO(task.getTaskId(), task.getTaskName(), task.getDescription(),
                                                 task.getPriority(), task.getExpectedFinishDate(), task.getFinishDate(), task.getTaskList().getListId());

        return ResponseEntity.ok(taskResponse);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<Void> updateTaskById(@PathVariable("taskId") String taskId, @RequestBody UpdateTaskDTO updateTaskDTO) {
        taskService.updateTaskById(taskId, updateTaskDTO);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTaksById(@PathVariable("taskId") String taskId) {
        taskService.deleteTaksById(taskId);
        return ResponseEntity.ok().build();
    }
    
}
