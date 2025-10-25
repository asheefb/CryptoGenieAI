package com.asheef.cryptogenie.repository;

import com.asheef.cryptogenie.model.Task;
import com.asheef.cryptogenie.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(TaskStatus status);

    List<Task> findByCreatorId(Long creatorId);

    List<Task> findByAcceptedByUserId(Long userId);
}
