package com.asheef.cryptogenie.service;

import com.asheef.cryptogenie.model.Task;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TaskService {

    public List<Task> getAllTasks();

    public List<Task> getOpenTasks();

    @Transactional
    public Task createTask(Long creatorId, String title, String description, Double reward);

    @Transactional
    public Task acceptTask(Long taskId, Long userId);

    @Transactional
    public Task submitTask(Long taskId, Long userId, String submissionDetails);

    @Transactional
    public Task approveTask(Long taskId, Long adminId);
}
