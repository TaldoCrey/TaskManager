package com.catijr.backend_java.Entities;

import java.time.Instant;
import java.util.UUID;

import com.catijr.backend_java.Enums.Priority;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "taskId")
    private UUID taskId;

    @Column(name = "taskName")
    private String taskName;

    @Column(name = "description")
    private String description;

    @Column(name = "priority")
    private Priority priority;

    @Column(name = "expectedFinishDate")
    private String expectedFinishDate;

    @Column(name = "FinishDate")
    private String finishDate;

    @ManyToOne
    @PrimaryKeyJoinColumn
    @JoinColumn(name = "tasklist_id")
    private TaskList taskList;

    public Task() {}

    public Task(String taskName, String description, Priority priority, String expectedFinishDate, TaskList taskList) {
        this.taskName = taskName;
        this.description = description;
        this.priority = priority;
        this.expectedFinishDate = expectedFinishDate;
        this.taskList = taskList;
        this.finishDate = null;
    }

    public UUID getTaskId() {
        return taskId;
    }

    public String getTaskName() {
        return taskName;
    }    

    public String getDescription() {
        return description;
    }

    public Priority getPriority() {
        return priority;
    }

    public String getExpectedFinishDate() {
        return expectedFinishDate;
    }

    public String getFinishDate() {
        return finishDate;
    }

    public TaskList getTaskList() {
        return taskList;
    }

    public void setTaskId(UUID taskId) {
        this.taskId = taskId;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }    

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public void setExpectedFinishDate(String expectedFinishDate) {
        this.expectedFinishDate = expectedFinishDate;
    }

    public void setFinishDate(String finishDate) {
        this.finishDate = finishDate;
    }

    public void setTaskList(TaskList taskList) {
        this.taskList = taskList;
    }
}
