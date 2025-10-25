package com.asheef.cryptogenie.controller;

import com.asheef.cryptogenie.model.Task;
import com.asheef.cryptogenie.model.User;
import com.asheef.cryptogenie.repository.UserRepository;
import com.asheef.cryptogenie.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    public TaskController(TaskService taskService, UserRepository userRepository) {
        this.taskService = taskService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/open")
    public ResponseEntity<List<Task>> getOpenTasks() {
        return ResponseEntity.ok(taskService.getOpenTasks());
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String title = (String) request.get("title");
            String description = (String) request.get("description");
            Double reward = ((Number) request.get("reward")).doubleValue();

            Task task = taskService.createTask(user.getId(), title, description, reward);
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{taskId}/accept")
    public ResponseEntity<Task> acceptTask(@PathVariable Long taskId, Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Task task = taskService.acceptTask(taskId, user.getId());
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{taskId}/submit")
    public ResponseEntity<Task> submitTask(@PathVariable Long taskId, @RequestBody Map<String, String> request,
                                           Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String submissionDetails = request.get("submissionDetails");
            Task task = taskService.submitTask(taskId, user.getId(), submissionDetails);
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{taskId}/approve")
    public ResponseEntity<Task> approveTask(@PathVariable Long taskId, Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Task task = taskService.approveTask(taskId, user.getId());
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
