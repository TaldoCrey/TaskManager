package com.catijr.backend_java.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.catijr.backend_java.Entities.TaskList;

@Repository
public interface ListRepository extends JpaRepository<TaskList, UUID> {

    Optional<TaskList> findByListName(String nome);
}
