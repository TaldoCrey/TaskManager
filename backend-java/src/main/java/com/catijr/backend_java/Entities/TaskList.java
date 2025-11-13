package com.catijr.backend_java.Entities;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name="tb_lists")
public class TaskList {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="listid")
    private UUID listId;

    @Column(name = "listname")
    private String listName;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "taskList")
    private List<Task> tasks;

    public TaskList() {}

    public TaskList(String listName, List<Task> tasks) {
        this.listName = listName;
        this.tasks = tasks;
    }

    public UUID getListId() {
        return listId;
    }

    public String getListName() {
        return listName;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setListName(String listName) {
        this.listName = listName;
    }

    public void setListId(UUID listId) {
        this.listId = listId;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
}
