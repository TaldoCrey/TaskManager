package com.catijr.backend_java.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.catijr.backend_java.Entities.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

}
