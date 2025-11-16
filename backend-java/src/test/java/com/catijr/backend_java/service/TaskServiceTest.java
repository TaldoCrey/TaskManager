package com.catijr.backend_java.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import com.catijr.backend_java.Entities.Task;
import com.catijr.backend_java.Entities.TaskList;
import com.catijr.backend_java.Enums.Priority;
import com.catijr.backend_java.dto.CreateListDTO;
import com.catijr.backend_java.dto.CreateTaskDTO;
import com.catijr.backend_java.dto.UpdateTaskDTO;
import com.catijr.backend_java.repositories.ListRepository;
import com.catijr.backend_java.repositories.TaskRepository;
import com.catijr.backend_java.services.TaskService;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ListRepository listRepository;

    @InjectMocks
    private TaskService taskService;

    @Captor
    private ArgumentCaptor<UUID> uuidArgCaptor;

    @Captor
    private ArgumentCaptor<Task> taskArgCaptor;

    @Nested
    class createTask {
        @Test
        void shouldThrowExceptionWhenErrorOccurs() {
            //Arrange
            var list = new TaskList(
                "list",
                new ArrayList<Task>()
            );
            var listId = UUID.randomUUID();
            list.setListId(listId);
            var input = new CreateTaskDTO(
                "task",
                "",
                "LOW",
                "25/12/25",
                listId.toString()
            );

            doReturn(Optional.of(list)).when(listRepository).findById(uuidArgCaptor.capture());
            doThrow(new RuntimeException()).when(taskRepository).save(any());
            //Act + Assert
            assertThrows(RuntimeException.class, () -> taskService.createTask(input));
        }

        @Test
        void shouldCreateTaskWithSuccess() {
            //Arrange
            var list = new TaskList(
                "list",
                new ArrayList<Task>()
            );
            var listId = UUID.randomUUID();
            var expected = new Task(
                "task",
                "",
                Priority.valueOf("LOW"),
                "25/12/25",
                list
            );
            var taskId = UUID.randomUUID();
            list.setListId(listId);
            expected.setTaskId(taskId);
            doReturn(Optional.of(list)).when(listRepository).findById(uuidArgCaptor.capture());
            doReturn(expected).when(taskRepository).save(taskArgCaptor.capture());
            var input = new CreateTaskDTO(
                "task",
                "",
                "LOW",
                "25/12/25",
                listId.toString()
            );
            //Act
            var output = taskService.createTask(input);
            //Assert
            assertNotNull(output);

            var taskCaptured = taskArgCaptor.getValue();
            assertEquals(expected.getTaskId(), output);
            assertEquals(expected.getTaskName(), taskCaptured.getTaskName());
            assertEquals(expected.getDescription(), taskCaptured.getDescription());
            assertEquals(expected.getPriority(), taskCaptured.getPriority());
            assertEquals(expected.getExpectedFinishDate(), taskCaptured.getExpectedFinishDate());
            assertEquals(expected.getFinishDate(), taskCaptured.getFinishDate());
            assertEquals(expected.getTaskList().getListId(), taskCaptured.getTaskList().getListId());

            verify(taskRepository, times(1)).save(taskCaptured);
        }

        @Test
        void shouldThrowNotFoundIfListIdDowsNotExists() {
            //Arrange
            var listId = UUID.randomUUID();
            doReturn(Optional.empty()).when(listRepository).findById(uuidArgCaptor.capture());
            var input = new CreateTaskDTO(
                "task",
                "",
                "LOW",
                "25/12/25",
                listId.toString()
            );
            //Act + Assert
            assertThrows(ResponseStatusException.class, () -> taskService.createTask(input));

            verify(listRepository, times(1)).findById(uuidArgCaptor.getValue());
        }
    }

    @Nested
    class getTaskById {
        @Test
        void shouldGetTaskByIdWithSuccess() {
            //Arrange
            var list = new TaskList(
                "list",
                new ArrayList<Task>()
            );
            var listId = UUID.randomUUID();
            var expected = new Task(
                "task",
                "",
                Priority.valueOf("LOW"),
                "25/12/25",
                list
            );
            var taskId = UUID.randomUUID();
            list.setListId(listId);
            expected.setTaskId(taskId);

            doReturn(Optional.of(expected)).when(taskRepository).findById(uuidArgCaptor.capture());
            //Act
            var output = taskService.getTaskById(taskId.toString());
            //Assert
            assertEquals(taskId, uuidArgCaptor.getValue());
            assertNotNull(output);

            assertEquals(expected.getTaskId(), output.getTaskId());
            assertEquals(expected.getTaskName(), output.getTaskName());
            assertEquals(expected.getDescription(), output.getDescription());
            assertEquals(expected.getPriority(), output.getPriority());
            assertEquals(expected.getExpectedFinishDate(), output.getExpectedFinishDate());
            assertEquals(expected.getFinishDate(), output.getFinishDate());
            assertEquals(expected.getTaskList().getListId(), output.getTaskList().getListId());

            verify(taskRepository, times(1)).findById(taskId);
        }

        @Test
        void shouldThrowNotFoundIfTaskIdDoesNotExists() {
            //Arrange
            var taskId = UUID.randomUUID();
            doReturn(Optional.empty()).when(taskRepository).findById(uuidArgCaptor.capture());
            //Act
            assertThrows(ResponseStatusException.class, () -> taskService.getTaskById(taskId.toString()));
            //Assert
            assertEquals(taskId, uuidArgCaptor.getValue());
            verify(taskRepository, times(1)).findById(taskId);
        }

        @Test 
        void shouldThrowExceptionWhenErrorOccurs() {
            //Arrange
            var taskId = UUID.randomUUID();

            doThrow(new RuntimeException()).when(taskRepository).findById(any());
            //Act + Assert
            assertThrows(RuntimeException.class, () -> taskService.getTaskById(taskId.toString()));
            verify(taskRepository, times(1)).findById(taskId);
        }
    }
    
    @Nested
    class updateTaskById {
        @Test
        void shouldUpdateTaskWithSuccessWhenEverythingIsFilled() {
            //Arrange
            var list = new TaskList(
                "list",
                new ArrayList<Task>()
            );
            var list2 = new TaskList(
                "list2",
                new ArrayList<Task>()
            );
            list2.setListId(UUID.randomUUID());
            var listId = UUID.randomUUID();
            var existingTask = new Task(
                "task",
                "",
                Priority.valueOf("LOW"),
                "25/12/25",
                list2
            );
            var expected = new Task(
                "taskUpdated",
                "desc",
                Priority.valueOf("HIGH"),
                "31/12/25",
                list
            );
            var taskId = UUID.randomUUID();
            existingTask.setTaskId(taskId);
            list.setListId(listId);
            expected.setTaskId(taskId);
            expected.setFinishDate("29/12/25");
            doReturn(Optional.of(existingTask)).when(taskRepository).findById(uuidArgCaptor.capture());
            doReturn(Optional.of(list)).when(listRepository).findById(listId);
            doReturn(expected).when(taskRepository).save(taskArgCaptor.capture());
            var input = new UpdateTaskDTO(
                "taskUpdated",
                "desc",
                "HIGH",
                "31/12/25",
                listId.toString(),
                "29/12/25"
            );
            //Act
            taskService.updateTaskById(taskId.toString(), input);
            //Assert

            var taskCaptured = taskArgCaptor.getValue();
            assertEquals(expected.getTaskId(), taskCaptured.getTaskId());
            assertEquals(expected.getTaskName(), taskCaptured.getTaskName());
            assertEquals(expected.getDescription(), taskCaptured.getDescription());
            assertEquals(expected.getPriority(), taskCaptured.getPriority());
            assertEquals(expected.getExpectedFinishDate(), taskCaptured.getExpectedFinishDate());
            assertEquals(expected.getFinishDate(), taskCaptured.getFinishDate());
            assertEquals(expected.getTaskList().getListId(), taskCaptured.getTaskList().getListId());
            verify(taskRepository, times(1)).save(taskCaptured);
        }

        @Test
        void shouldUpdateTaskWithSuccessWhenOnlyListHaveChanged() {
            //Arrange
            var list = new TaskList(
                "list",
                new ArrayList<Task>()
            );
            var list2 = new TaskList(
                "list2",
                new ArrayList<Task>()
            );
            list2.setListId(UUID.randomUUID());
            var listId = UUID.randomUUID();
            var existingTask = new Task(
                "task",
                "",
                Priority.valueOf("LOW"),
                "25/12/25",
                list2
            );
            var expected = new Task(
                "task",
                "",
                Priority.valueOf("LOW"),
                "25/12/25",
                list
            );
            var taskId = UUID.randomUUID();
            existingTask.setTaskId(taskId);
            list.setListId(listId);
            expected.setTaskId(taskId);
            doReturn(Optional.of(existingTask)).when(taskRepository).findById(uuidArgCaptor.capture());
            doReturn(Optional.of(list)).when(listRepository).findById(listId);
            doReturn(expected).when(taskRepository).save(taskArgCaptor.capture());
            var input = new UpdateTaskDTO(
                null,
                null,
                null,
                null,
                listId.toString(),
                null
            );
            //Act
            taskService.updateTaskById(taskId.toString(), input);
            //Assert

            var taskCaptured = taskArgCaptor.getValue();
            assertEquals(expected.getTaskId(), taskCaptured.getTaskId());
            assertEquals(expected.getTaskName(), taskCaptured.getTaskName());
            assertEquals(expected.getDescription(), taskCaptured.getDescription());
            assertEquals(expected.getPriority(), taskCaptured.getPriority());
            assertEquals(expected.getExpectedFinishDate(), taskCaptured.getExpectedFinishDate());
            assertEquals(expected.getFinishDate(), taskCaptured.getFinishDate());
            assertEquals(expected.getTaskList().getListId(), taskCaptured.getTaskList().getListId());
            verify(taskRepository, times(1)).save(taskCaptured);
        }

        @Test
        void shouldThrowNotFoundWhenChangedListDoesNotExists() {
            //Arrange
            var list = new TaskList(
                "list",
                new ArrayList<Task>()
            );
            var listId = UUID.randomUUID();
            var existingTask = new Task(
                "task",
                "",
                Priority.valueOf("LOW"),
                "25/12/25",
                list
            );
            var taskId = UUID.randomUUID();
            existingTask.setTaskId(taskId);
            list.setListId(listId);
            doReturn(Optional.of(existingTask)).when(taskRepository).findById(uuidArgCaptor.capture());
            doReturn(Optional.empty()).when(listRepository).findById(uuidArgCaptor.capture());
            var input = new UpdateTaskDTO(
                null,
                null,
                null,
                null,
                UUID.randomUUID().toString(),
                null
            );
            //Act
            assertThrows(ResponseStatusException.class, () -> taskService.updateTaskById(taskId.toString(), input));
            var IdCaptured = uuidArgCaptor.getAllValues();
            assertEquals(taskId, IdCaptured.get(0));
            assertEquals(UUID.fromString(input.listId()), IdCaptured.get(1));
        }

        @Test
        void shouldUpdateTaskWithSuccessWhenTaskOnlyHaveBeenFinished() {
            //Arrange
            var list = new TaskList(
                "list",
                new ArrayList<Task>()
            );
            var listId = UUID.randomUUID();
            var existingTask = new Task(
                "task",
                "",
                Priority.valueOf("LOW"),
                "25/12/25",
                list
            );
            var expected = new Task(
                "task",
                "",
                Priority.valueOf("LOW"),
                "25/12/25",
                list
            );
            var taskId = UUID.randomUUID();
            existingTask.setTaskId(taskId);
            existingTask.setFinishDate("31/12/25");
            list.setListId(listId);
            expected.setTaskId(taskId);
            expected.setFinishDate("31/12/25");
            doReturn(Optional.of(existingTask)).when(taskRepository).findById(uuidArgCaptor.capture());
            doReturn(expected).when(taskRepository).save(taskArgCaptor.capture());
            var input = new UpdateTaskDTO(
                null,
                null,
                null,
                null,
                null,
                "31/12/25"
            );
            //Act
            taskService.updateTaskById(taskId.toString(), input);
            //Assert

            var taskCaptured = taskArgCaptor.getValue();
            assertEquals(expected.getTaskId(), taskCaptured.getTaskId());
            assertEquals(expected.getTaskName(), taskCaptured.getTaskName());
            assertEquals(expected.getDescription(), taskCaptured.getDescription());
            assertEquals(expected.getPriority(), taskCaptured.getPriority());
            assertEquals(expected.getExpectedFinishDate(), taskCaptured.getExpectedFinishDate());
            assertEquals(expected.getFinishDate(), taskCaptured.getFinishDate());
            assertEquals(expected.getTaskList().getListId(), taskCaptured.getTaskList().getListId());
            verify(taskRepository, times(1)).save(taskCaptured);
        }

        @Test
        void shouldUpdateTaskWithSuccessWhenOnlyExpectedFinishDateHaveChanged() {
            //Arrange
            var list = new TaskList(
                "list",
                new ArrayList<Task>()
            );
            var listId = UUID.randomUUID();
            var existingTask = new Task(
                "task",
                "",
                Priority.valueOf("LOW"),
                "25/12/25",
                list
            );
            var expected = new Task(
                "task",
                "",
                Priority.valueOf("LOW"),
                "31/12/25",
                list
            );
            var taskId = UUID.randomUUID();
            existingTask.setTaskId(taskId);
            list.setListId(listId);
            expected.setTaskId(taskId);
            doReturn(Optional.of(existingTask)).when(taskRepository).findById(uuidArgCaptor.capture());
            doReturn(expected).when(taskRepository).save(taskArgCaptor.capture());
            var input = new UpdateTaskDTO(
                null,
                null,
                null,
                "31/12/25",
                null,
                null
            );
            //Act
            taskService.updateTaskById(taskId.toString(), input);
            //Assert

            var taskCaptured = taskArgCaptor.getValue();
            assertEquals(expected.getTaskId(), taskCaptured.getTaskId());
            assertEquals(expected.getTaskName(), taskCaptured.getTaskName());
            assertEquals(expected.getDescription(), taskCaptured.getDescription());
            assertEquals(expected.getPriority(), taskCaptured.getPriority());
            assertEquals(expected.getExpectedFinishDate(), taskCaptured.getExpectedFinishDate());
            assertEquals(expected.getFinishDate(), taskCaptured.getFinishDate());
            assertEquals(expected.getTaskList().getListId(), taskCaptured.getTaskList().getListId());
            verify(taskRepository, times(1)).save(taskCaptured);
        }

        @Test
        void shouldUpdateTaskWithSuccessWhenOnlyPriorityHaveChanged() {
            //Arrange
            var list = new TaskList(
                "list",
                new ArrayList<Task>()
            );
            var listId = UUID.randomUUID();
            var existingTask = new Task(
                "task",
                "",
                Priority.valueOf("LOW"),
                "25/12/25",
                list
            );
            var expected = new Task(
                "task",
                "",
                Priority.valueOf("HIGH"),
                "25/12/25",
                list
            );
            var taskId = UUID.randomUUID();
            existingTask.setTaskId(taskId);
            list.setListId(listId);
            expected.setTaskId(taskId);
            doReturn(Optional.of(existingTask)).when(taskRepository).findById(uuidArgCaptor.capture());
            doReturn(expected).when(taskRepository).save(taskArgCaptor.capture());
            var input = new UpdateTaskDTO(
                null,
                null,
                "HIGH",
                null,
                null,
                null
            );
            //Act
            taskService.updateTaskById(taskId.toString(), input);
            //Assert

            var taskCaptured = taskArgCaptor.getValue();
            assertEquals(expected.getTaskId(), taskCaptured.getTaskId());
            assertEquals(expected.getTaskName(), taskCaptured.getTaskName());
            assertEquals(expected.getDescription(), taskCaptured.getDescription());
            assertEquals(expected.getPriority(), taskCaptured.getPriority());
            assertEquals(expected.getExpectedFinishDate(), taskCaptured.getExpectedFinishDate());
            assertEquals(expected.getFinishDate(), taskCaptured.getFinishDate());
            assertEquals(expected.getTaskList().getListId(), taskCaptured.getTaskList().getListId());
            verify(taskRepository, times(1)).save(taskCaptured);
        }

        @Test
        void shouldUpdateTaskWithSuccessWhenOnlyDescriptionHaveChanged() {
            //Arrange
            var list = new TaskList(
                "list",
                new ArrayList<Task>()
            );
            var listId = UUID.randomUUID();
            var existingTask = new Task(
                "task",
                "",
                Priority.valueOf("LOW"),
                "25/12/25",
                list
            );
            var expected = new Task(
                "task",
                "desc",
                Priority.valueOf("LOW"),
                "25/12/25",
                list
            );
            var taskId = UUID.randomUUID();
            existingTask.setTaskId(taskId);
            list.setListId(listId);
            expected.setTaskId(taskId);
            doReturn(Optional.of(existingTask)).when(taskRepository).findById(uuidArgCaptor.capture());
            doReturn(expected).when(taskRepository).save(taskArgCaptor.capture());
            var input = new UpdateTaskDTO(
                null,
                "desc",
                null,
                null,
                null,
                null
            );
            //Act
            taskService.updateTaskById(taskId.toString(), input);
            //Assert

            var taskCaptured = taskArgCaptor.getValue();
            assertEquals(expected.getTaskId(), taskCaptured.getTaskId());
            assertEquals(expected.getTaskName(), taskCaptured.getTaskName());
            assertEquals(expected.getDescription(), taskCaptured.getDescription());
            assertEquals(expected.getPriority(), taskCaptured.getPriority());
            assertEquals(expected.getExpectedFinishDate(), taskCaptured.getExpectedFinishDate());
            assertEquals(expected.getFinishDate(), taskCaptured.getFinishDate());
            assertEquals(expected.getTaskList().getListId(), taskCaptured.getTaskList().getListId());
            verify(taskRepository, times(1)).save(taskCaptured);
        }

        @Test
        void shouldUpdateTaskWithSuccessWhenOnlyNameHaveChanged() {
            //Arrange
            var list = new TaskList(
                "list",
                new ArrayList<Task>()
            );
            var listId = UUID.randomUUID();
            var existingTask = new Task(
                "task",
                "",
                Priority.valueOf("LOW"),
                "25/12/25",
                list
            );
            var expected = new Task(
                "updatedName",
                "",
                Priority.valueOf("LOW"),
                "25/12/25",
                list
            );
            var taskId = UUID.randomUUID();
            existingTask.setTaskId(taskId);
            list.setListId(listId);
            expected.setTaskId(taskId);
            doReturn(Optional.of(existingTask)).when(taskRepository).findById(uuidArgCaptor.capture());
            doReturn(expected).when(taskRepository).save(taskArgCaptor.capture());
            var input = new UpdateTaskDTO(
                "updatedName",
                null,
                null,
                null,
                null,
                null
            );
            //Act
            taskService.updateTaskById(taskId.toString(), input);
            //Assert

            var taskCaptured = taskArgCaptor.getValue();
            assertEquals(expected.getTaskId(), taskCaptured.getTaskId());
            assertEquals(expected.getTaskName(), taskCaptured.getTaskName());
            assertEquals(expected.getDescription(), taskCaptured.getDescription());
            assertEquals(expected.getPriority(), taskCaptured.getPriority());
            assertEquals(expected.getExpectedFinishDate(), taskCaptured.getExpectedFinishDate());
            assertEquals(expected.getFinishDate(), taskCaptured.getFinishDate());
            assertEquals(expected.getTaskList().getListId(), taskCaptured.getTaskList().getListId());
            verify(taskRepository, times(1)).save(taskCaptured);
        }

        @Test
        void shouldDoNothingOnlyNameIsFilledAndIsEmpty() {
            //Arrange
            var list = new TaskList(
                "list",
                new ArrayList<Task>()
            );
            var listId = UUID.randomUUID();
            var existingTask = new Task(
                "task",
                "",
                Priority.valueOf("LOW"),
                "25/12/25",
                list
            );
            var expected = new Task(
                "task",
                "",
                Priority.valueOf("LOW"),
                "25/12/25",
                list
            );
            var taskId = UUID.randomUUID();
            existingTask.setTaskId(taskId);
            list.setListId(listId);
            expected.setTaskId(taskId);
            doReturn(Optional.of(existingTask)).when(taskRepository).findById(uuidArgCaptor.capture());
            doReturn(expected).when(taskRepository).save(taskArgCaptor.capture());
            var input = new UpdateTaskDTO(
                "",
                null,
                null,
                null,
                null,
                null
            );
            //Act
            taskService.updateTaskById(taskId.toString(), input);
            //Assert

            var taskCaptured = taskArgCaptor.getValue();
            assertEquals(expected.getTaskId(), taskCaptured.getTaskId());
            assertEquals(expected.getTaskName(), taskCaptured.getTaskName());
            assertEquals(expected.getDescription(), taskCaptured.getDescription());
            assertEquals(expected.getPriority(), taskCaptured.getPriority());
            assertEquals(expected.getExpectedFinishDate(), taskCaptured.getExpectedFinishDate());
            assertEquals(expected.getFinishDate(), taskCaptured.getFinishDate());
            assertEquals(expected.getTaskList().getListId(), taskCaptured.getTaskList().getListId());
            verify(taskRepository, times(1)).save(taskCaptured);
        }

        @Test
        void shouldDoNothingWhenEverythingIsNull() {
            //Arrange
            var list = new TaskList(
                "list",
                new ArrayList<Task>()
            );
            var listId = UUID.randomUUID();
            var existingTask = new Task(
                "task",
                "",
                Priority.valueOf("LOW"),
                "25/12/25",
                list
            );
            var expected = new Task(
                "task",
                "",
                Priority.valueOf("LOW"),
                "25/12/25",
                list
            );
            var taskId = UUID.randomUUID();
            existingTask.setTaskId(taskId);
            list.setListId(listId);
            expected.setTaskId(taskId);
            doReturn(Optional.of(existingTask)).when(taskRepository).findById(uuidArgCaptor.capture());
            doReturn(expected).when(taskRepository).save(taskArgCaptor.capture());
            var input = new UpdateTaskDTO(
                null,
                null,
                null,
                null,
                null,
                null
            );
            //Act
            taskService.updateTaskById(taskId.toString(), input);
            //Assert

            var taskCaptured = taskArgCaptor.getValue();
            assertEquals(expected.getTaskId(), taskCaptured.getTaskId());
            assertEquals(expected.getTaskName(), taskCaptured.getTaskName());
            assertEquals(expected.getDescription(), taskCaptured.getDescription());
            assertEquals(expected.getPriority(), taskCaptured.getPriority());
            assertEquals(expected.getExpectedFinishDate(), taskCaptured.getExpectedFinishDate());
            assertEquals(expected.getFinishDate(), taskCaptured.getFinishDate());
            assertEquals(expected.getTaskList().getListId(), taskCaptured.getTaskList().getListId());
            verify(taskRepository, times(1)).save(taskCaptured);
        }

        @Test
        void shouldThrowNotFoundWhenTaskIdDoesNotExists() {
            //Arrange
            var taskId = UUID.randomUUID();
            doReturn(Optional.empty()).when(taskRepository).findById(uuidArgCaptor.capture());
            var input = new UpdateTaskDTO(
                null,
                null,
                null,
                null,
                null,
                null
            );
            //Act + Arrange
            assertThrows(ResponseStatusException.class, () -> taskService.updateTaskById(taskId.toString(), input));
            assertEquals(taskId, uuidArgCaptor.getValue());
        }

        @Test
        void shouldThrowExceptionWhenErrorOccurs() {
            //Arrange
            var taskId = UUID.randomUUID();
            doThrow(new RuntimeException()).when(taskRepository).findById(any());
            var input = new UpdateTaskDTO(
                null,
                null,
                null,
                null,
                null,
                null
            );
            //Act + Arrange
            assertThrows(RuntimeException.class, () -> taskService.updateTaskById(taskId.toString(), input));
        }
    }

    @Nested
    class deleteTaskById {
        @Test
        void shouldDeleteTaskByIdWithSucces() {
            //Arrange
            var id = UUID.randomUUID();
            doReturn(true).when(taskRepository).existsById(uuidArgCaptor.capture());
            doNothing().when(taskRepository).deleteById(uuidArgCaptor.capture());
            //Act
            taskService.deleteTaskById(id.toString());
            //Assert
            var IdCaptured = uuidArgCaptor.getAllValues();
            assertEquals(id, IdCaptured.get(0));
            assertEquals(id, IdCaptured.get(1));
            verify(taskRepository, times(1)).existsById(id);
            verify(taskRepository, times(1)).deleteById(id);
        }

        @Test
        void shouldThrowNotFoundIfIdDoesNodExists() {
            //Arrange
            var id = UUID.randomUUID();
            doReturn(false).when(taskRepository).existsById(uuidArgCaptor.capture());
            //Act + Assert
            assertThrows(ResponseStatusException.class, () -> taskService.deleteTaskById(id.toString()));
            assertEquals(id, uuidArgCaptor.getValue());
        }

        @Test
        void shouldThrowExceptionWhenErrorOccurs() {
            //Arrange
            var id = UUID.randomUUID();
            doThrow(new RuntimeException()).when(taskRepository).existsById(any());
            //Act + Assert
            assertThrows(RuntimeException.class, () -> taskService.deleteTaskById(id.toString()));
        }
    }

}
