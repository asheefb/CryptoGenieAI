package com.asheef.cryptogenie.service.impl;

import com.asheef.cryptogenie.model.Task;
import com.asheef.cryptogenie.model.TaskStatus;
import com.asheef.cryptogenie.model.TransactionType;
import com.asheef.cryptogenie.model.User;
import com.asheef.cryptogenie.repository.TaskRepository;
import com.asheef.cryptogenie.repository.UserRepository;
import com.asheef.cryptogenie.service.TaskService;
import com.asheef.cryptogenie.service.TransactionService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TransactionService transactionService;

    public TaskServiceImpl(TaskRepository taskRepository, UserRepository userRepository, TransactionService transactionService) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.transactionService = transactionService;
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public List<Task> getOpenTasks() {
        return taskRepository.findByStatus(TaskStatus.OPEN);
    }

    @Override
    public Task createTask(Long creatorId, String title, String description, Double reward) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (creator.getBalance() < reward) {
            throw new RuntimeException("Insufficient balance to create task");
        }

        creator.setBalance(creator.getBalance() - reward);
        userRepository.save(creator);

        Task task = new Task(creatorId, title, description, reward);
        return taskRepository.save(task);
    }

    @Override
    public Task acceptTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!TaskStatus.OPEN.equals(task.getStatus())) {
            throw new RuntimeException("Task is not available");
        }

        task.setStatus(TaskStatus.ACCEPTED);
        task.setAcceptedByUserId(userId);
        task.setAcceptedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    @Override
    public Task submitTask(Long taskId, Long userId, String submissionDetails) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!userId.equals(task.getAcceptedByUserId())) {
            throw new RuntimeException("Not authorized");
        }

        task.setStatus(TaskStatus.SUBMITTED);
        task.setSubmissionDetails(submissionDetails);
        task.setSubmittedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    @Override
    public Task approveTask(Long taskId, Long adminId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!TaskStatus.SUBMITTED.equals(task.getStatus())) {
            throw new RuntimeException("Task not submitted");
        }

        User worker = userRepository.findById(task.getAcceptedByUserId())
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        worker.setBalance(worker.getBalance() + task.getReward());
        userRepository.save(worker);

        transactionService.createTransaction(
                task.getAcceptedByUserId(),
                TransactionType.TASK_REWARD,
                task.getReward(),
                null,
                "Task completed: " + task.getTitle()
        );

        task.setStatus(TaskStatus.COMPLETED);
        task.setCompletedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }
}
