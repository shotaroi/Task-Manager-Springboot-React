package com.example.taskmanager;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class TaskService {
    
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> findAll() {
        return taskRepository.findAll();
    }

    public Task findById(Long id) {
        return taskRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public Task create(Task task) {
        return taskRepository.save(task);
    }


}
