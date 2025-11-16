package com.catijr.backend_java.services;

import java.util.UUID;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.catijr.backend_java.Entities.Task;
import com.catijr.backend_java.Entities.TaskList;
import com.catijr.backend_java.dto.CreateListDTO;
import com.catijr.backend_java.dto.UpdateListDTO;
import com.catijr.backend_java.repositories.ListRepository;

@Service
public class ListService {

    private ListRepository listRepository;

    public ListService(ListRepository listRepository) {
        this.listRepository = listRepository;
    }

    public UUID createList(CreateListDTO createListDTO) {
        var listExists = listRepository.findByListName(createListDTO.listname());
        if (listExists.isPresent() || createListDTO.listname() == null || createListDTO.listname().trim() == "") {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }

        var list = new TaskList(
            createListDTO.listname(),
            new ArrayList<Task>()
        );

        var savedList = listRepository.save(list);
        return savedList.getListId();
    }

    public List<TaskList> getLists() {
        var tasklists = listRepository.findAll();

        return tasklists;
    }

    public TaskList getListById(String listId) {

        var list = listRepository.findById(UUID.fromString(listId)).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return list;
    }

    public void updateListById(String listId, UpdateListDTO updateListDTO) {
        var list = listRepository.findById(UUID.fromString(listId)).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (updateListDTO.listname() != null ) {
            if(listRepository.findByListName(updateListDTO.listname()).isPresent() || updateListDTO.listname().trim() == "") {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
            }

            list.setListName(updateListDTO.listname());
        }

        listRepository.save(list);
    }

    public void deleteListById(String listId) {
        var id = UUID.fromString(listId);
        if (listRepository.existsById(id)) {
            listRepository.deleteById(id);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }
}
