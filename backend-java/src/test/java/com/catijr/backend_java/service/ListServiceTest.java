package com.catijr.backend_java.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.apache.catalina.connector.Response;
import org.assertj.core.util.Arrays;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.catijr.backend_java.Entities.Task;
import com.catijr.backend_java.Entities.TaskList;
import com.catijr.backend_java.dto.CreateListDTO;
import com.catijr.backend_java.dto.UpdateListDTO;
import com.catijr.backend_java.repositories.ListRepository;
import com.catijr.backend_java.services.ListService;


@ExtendWith(MockitoExtension.class)
public class ListServiceTest {

    @Mock
    private ListRepository listRepository;

    @InjectMocks
    private ListService listService;

    @Captor
    private ArgumentCaptor<TaskList> listArgCaptor;

    @Captor
    private ArgumentCaptor<UUID> uuidArgCaptor;
    
    @Captor
    private ArgumentCaptor<String> stringArgCaptor;

    @Nested
    class createList {
        @Test
        void shouldCreateListWithSuccess() {
            //Arrange
            var expected = new TaskList(
                "list",
                new ArrayList<Task>()
            );
            var listId = UUID.randomUUID();
            expected.setListId(listId);
            doReturn(expected).when(listRepository).save(listArgCaptor.capture());
            var input = new CreateListDTO("list");
            //Act
            var output = listService.createList(input);
            //Assert
            assertNotNull(output);

            var listCaptured = listArgCaptor.getValue();
            assertEquals(input.listname(), listCaptured.getListName());
        }

        @Test
        void shouldThrowExceptionsWhenErrorsOccurs() {
            //Arrange
            doThrow(new RuntimeException()).when(listRepository).save(any());
            var input = new CreateListDTO("list");
            //Act + Assert
            assertThrows(RuntimeException.class, () -> listService.createList(input));
        }

        @Test
        void shouldThrowBadRequestWhenListnameAlreadyExists() {
            //Arrange
            var existingList = new TaskList(
                "list",
                new ArrayList<Task>()
            );
            var listId = UUID.randomUUID();
            existingList.setListId(listId);
            doReturn(Optional.of(existingList)).when(listRepository)
                .findByListName(stringArgCaptor.capture());
            var input = new CreateListDTO("list");
            //Act + Assert
            assertThrows(ResponseStatusException.class, () -> listService.createList(input));
            assertEquals(input.listname(), stringArgCaptor.getValue());
        }

        @Test
        void shouldThrowBadRequestWhenListnameIsEmpty() {
            //Arrange
            doReturn(Optional.empty()).when(listRepository).findByListName(stringArgCaptor.capture());
            var input = new CreateListDTO("");
            //Act + Assert
            assertThrows(ResponseStatusException.class, () -> listService.createList(input));
            assertEquals(input.listname(), stringArgCaptor.getValue());
        }

        @Test
        void shouldThrowBadRequestWhenNoListNameIsReceived() {
            //Arrange
            doReturn(Optional.empty()).when(listRepository).findByListName(stringArgCaptor.capture());
            var input = new CreateListDTO(null);
            //Act + Assert
            assertThrows(ResponseStatusException.class, () -> listService.createList(input));
            assertEquals(input.listname(), stringArgCaptor.getValue());
        }
    }

    @Nested
    class getLists {
        @Test
        void shouldGetAllListWithSuccess() {
            //Arrange
            var list = new TaskList(
                "list",
                new ArrayList<Task>()
            );

            var lists = List.of(list);
            doReturn(lists).when(listRepository).findAll();
            //Act
            var output = listService.getLists();
            //Assert
            assertNotNull(output);
            assertEquals(lists.size(), output.size());
        }

        @Test
        void shouldReturnEmptyArrayWithSuccess() {
            //Arrange
            doReturn(Collections.emptyList()).when(listRepository).findAll();
            //Act
            var output = listService.getLists();
            //Assert
            assertNotNull(output);
            assertEquals(0, output.size());
            verify(listRepository, times(1)).findAll();
        }

        @Test
        void shouldThrowExceptionsWhenErrorsOccurs() {
            //Arrange
            doThrow(new RuntimeException()).when(listRepository).findAll();
            //Act + Assert
            assertThrows(RuntimeException.class, () -> listService.getLists());
        }
    }

    @Nested
    class getListById {
        @Test
        void shouldThrowExceptionsWhenErrorsOccurs() {
            //Arrange
            doThrow(new RuntimeException()).when(listRepository).findById(any());
            var input = UUID.randomUUID();
            //Act + Assert
            assertThrows(RuntimeException.class, () -> listService.getListById(input.toString()));
        }

        @Test
        void shouldGetListByIdWithSucces() {
            //Arrange
            var list = new TaskList(
                "list",
                new ArrayList<Task>()
            );
            var id = UUID.randomUUID();
            list.setListId(id);
            doReturn(Optional.of(list)).when(listRepository).findById(uuidArgCaptor.capture());
            //Act
            var output = listService.getListById(id.toString());
            //Assert
            assertNotNull(output);
            assertEquals(id, uuidArgCaptor.getValue());
            assertEquals(list.getListName(), output.getListName());
            assertEquals(list.getListId(), output.getListId());
            verify(listRepository, times(1)).findById(uuidArgCaptor.getValue());
        }

        @Test
        void shouldThrowNotFoundWhenListIdDoesNotExist() {
            //Arrange
            var id = UUID.randomUUID();
            doReturn(Optional.empty()).when(listRepository).findById(uuidArgCaptor.capture());
            //Assert + Act
            assertThrows(ResponseStatusException.class, () -> listService.getListById(id.toString()));
        }
    }

    @Nested
    class updateListById {
        @Test
        void shouldThrowExceptionsWhenErrorsOccurs() {
            //Arrange
            doThrow(new RuntimeException()).when(listRepository).findById(any());
            var input = new UpdateListDTO("list");
            //Act + Assert
            assertThrows(RuntimeException.class, () -> listService.updateListById(UUID.randomUUID().toString(), input));
        }

        @Test
        void shouldUpdateListWithSuccessWhenListNameIsFilledAndNameStillUnique() {
            //Arrange
            var expected = new TaskList(
                "list2",
                new ArrayList<Task>()
            );
            var id = UUID.randomUUID();
            expected.setListId(id);
            doReturn(Optional.of(expected)).when(listRepository).findById(uuidArgCaptor.capture());
            doReturn(Optional.empty()).when(listRepository).findByListName(stringArgCaptor.capture());
            doReturn(expected).when(listRepository).save(listArgCaptor.capture());
            var input = new UpdateListDTO("list2");
            //Act
            listService.updateListById(id.toString(), input);
            //Assert
            assertEquals(id, uuidArgCaptor.getValue());
            assertEquals(input.listname(), stringArgCaptor.getValue());
            assertNotNull(stringArgCaptor.getValue());
            var updatedList = listArgCaptor.getValue();
            assertEquals(input.listname(), updatedList.getListName());
            assertEquals(0, updatedList.getTasks().size());
            verify(listRepository, times(1)).findById(id);
            verify(listRepository, times(1)).findByListName(stringArgCaptor.getValue());
            verify(listRepository, times(1)).save(listArgCaptor.getValue());
        }

        @Test
        void shouldDoNothingIfListNameIsNull() {
            //Arrange
            var expected = new TaskList(
                "list",
                new ArrayList<Task>()
            );
            var id = UUID.randomUUID();
            expected.setListId(id);
            doReturn(Optional.of(expected)).when(listRepository).findById(uuidArgCaptor.capture());
            doReturn(expected).when(listRepository).save(listArgCaptor.capture());
            var input = new UpdateListDTO(null);
            //Act
            listService.updateListById(id.toString(), input);
            //Assert
            assertEquals(id, uuidArgCaptor.getValue());
            var updatedList = listArgCaptor.getValue();
            assertEquals(expected.getListName(), updatedList.getListName());
            assertEquals(expected.getTasks().size(), updatedList.getTasks().size());
            verify(listRepository, times(1)).findById(id);
            verify(listRepository, times(1)).save(listArgCaptor.getValue());        
        }

        @Test
        void shouldThrowBadRequestWhenListNameAlreadyExists() {
            //Arrange
            var expected = new TaskList(
                "list2",
                new ArrayList<Task>()
            );
            var existingList = new TaskList(
                "list",
                new ArrayList<Task>()
            );
            var id = UUID.randomUUID();
            expected.setListId(id);
            doReturn(Optional.of(expected)).when(listRepository).findById(uuidArgCaptor.capture());
            doReturn(Optional.of(existingList)).when(listRepository).findByListName(stringArgCaptor.capture());
            var input = new UpdateListDTO("list");
            //Assert + Act
            assertThrows(ResponseStatusException.class, () -> listService.updateListById(id.toString(), input));
            assertEquals(id, uuidArgCaptor.getValue());
            assertNotNull(stringArgCaptor.getValue());
        }

        @Test
        void shouldThrowBadRequestWhenListNameIsEmpty() {
            //Arrange
            var expected = new TaskList(
                "list2",
                new ArrayList<Task>()
            );
            var id = UUID.randomUUID();
            expected.setListId(id);
            doReturn(Optional.of(expected)).when(listRepository).findById(uuidArgCaptor.capture());
            var input = new UpdateListDTO("");
            //Assert + Act
            assertThrows(ResponseStatusException.class, () -> listService.updateListById(id.toString(), input));
            assertEquals(id, uuidArgCaptor.getValue());
        }

        @Test
        void shouldThrowNotFoundIfIdDoesNotExists() {
            //Arrange
            var id = UUID.randomUUID();
            doReturn(Optional.empty()).when(listRepository).findById(uuidArgCaptor.capture());
            var input = new UpdateListDTO("list2");
            //Assert + Act
            assertThrows(ResponseStatusException.class, () -> listService.updateListById(id.toString(), input));
            assertEquals(id, uuidArgCaptor.getValue());
        }
    }

    @Nested
    class deleteListById {
        @Test
        void shouldThrowExceptionsWhenErrorsOccurs() {
            //Arrange
            doThrow(new RuntimeException()).when(listRepository).existsById(any());
            var input = UUID.randomUUID();
            //Act + Assert
            assertThrows(RuntimeException.class, () -> listService.deleteListById(input.toString()));
        }

        @Test
        void shouldDeleteListByIdWithSuccess() {
            //Arrange
            var id = UUID.randomUUID();
            var list = new TaskList(
                "list",
                new ArrayList<Task>()
            );
            doReturn(true).when(listRepository).existsById(uuidArgCaptor.capture());
            doNothing().when(listRepository).deleteById(uuidArgCaptor.capture());
            //Act
            listService.deleteListById(id.toString());
            //Assert
            var idCaptured = uuidArgCaptor.getAllValues();
            assertEquals(id, idCaptured.get(0));
            assertEquals(id, idCaptured.get(1));
        }

        @Test
        void shouldThrowNotFoundIfIdNotExists() {
            //Arrange
            var id = UUID.randomUUID();
            doReturn(false).when(listRepository).existsById(uuidArgCaptor.capture());
            //Assert + Act
            assertThrows(ResponseStatusException.class, () -> listService.deleteListById(id.toString()));
            assertEquals(id, uuidArgCaptor.getValue());
        }
    }
}
