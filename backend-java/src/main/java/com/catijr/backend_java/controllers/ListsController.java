package com.catijr.backend_java.controllers;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.catijr.backend_java.Entities.TaskList;
import com.catijr.backend_java.dto.CreateListDTO;
import com.catijr.backend_java.dto.CreateListResponseDTO;
import com.catijr.backend_java.dto.ListResponseDTO;
import com.catijr.backend_java.dto.UpdateListDTO;
import com.catijr.backend_java.services.ListService;




@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/v1/lists")
public class ListsController {

    private ListService listService;

    public ListsController(ListService listService) {
        this.listService = listService;
    }
    
    @PostMapping
    public ResponseEntity<CreateListResponseDTO> createList(@RequestBody CreateListDTO createListDto) {
        var listID = listService.createList(createListDto);

        var responseDTO = new CreateListResponseDTO(listID);

        return ResponseEntity.created(URI.create("/v1/lists/" + listID.toString())).body(responseDTO);
    }

    @GetMapping
    public ResponseEntity<List<ListResponseDTO>> getLists() {
        var tasklists = listService.getLists();

        List<ListResponseDTO> lists = new ArrayList<>();

        for (TaskList tl : tasklists) {
            lists.add(new ListResponseDTO(tl));
        }
        return ResponseEntity.ok(lists);
    }

    @GetMapping("/{listId}")
    public ResponseEntity<ListResponseDTO> getListById(@PathVariable("listId") String listId) {
        var list = listService.getListById(listId);
        
        var listResponse = new ListResponseDTO(list);

        return ResponseEntity.ok(listResponse);
    }

    @PutMapping("/{listId}")
    public ResponseEntity<Void> updateListById(@PathVariable("listId") String listId, @RequestBody UpdateListDTO updateListDTO) {
        listService.updateListById(listId, updateListDTO);
        return ResponseEntity.ok().build();
    } 
    
    @DeleteMapping("/{listId}")
    public ResponseEntity<Void> deleteListById(@PathVariable("listId") String listId) {
        listService.deleteListById(listId);
        return ResponseEntity.ok().build();
    }
}
