package com.asheef.cryptogenie.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long creatorId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private Double reward;

    @Column(nullable = false)
    private TaskStatus status = TaskStatus.OPEN;

    private Long acceptedByUserId;

    private String submissionDetails;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime acceptedAt;

    private LocalDateTime submittedAt;

    private LocalDateTime completedAt;


    public Task(Long creatorId, String title, String description, Double reward) {
        this.creatorId = creatorId;
        this.title = title;
        this.description = description;
        this.reward = reward;
        this.createdAt = LocalDateTime.now();
    }
}
