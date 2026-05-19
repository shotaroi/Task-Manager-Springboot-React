import axios from "axios";

const API_URL = "http://localhost:8080/api/tasks";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskRequest {
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: string;
}

export async function getTasks() {
    const response = await axios.get<Task[]>(API_URL);
    return response.data;
}

export async function createTask(task: CreateTaskRequest) {
    const response = await axios.post<Task>(API_URL, task);
    return response.data;
}

export async function deleteTask(id: number) {
    await axios.delete(`${API_URL}/${id}`);
}

export interface UpdateTaskRequest {
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: string;
}

export async function updateTask(id: number, task: UpdateTaskRequest) {
    const response = await axios.put<Task>(`${API_URL}/${id}`, task);
    return response.data;
}