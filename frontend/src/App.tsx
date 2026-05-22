import { useEffect, useState } from "react";
import "./App.css";
import { 
  createTask,
  getTasks,
  deleteTask,
  updateTask,
  type Task, 
  type TaskStatus,
} from "./api/tasks";
import { TaskCard } from "./components/TaskCard";
import { TaskForm } from './components/TaskForm';
import { TaskToolbar } from './components/TaskToolbar';
import type { StatusFilter, SortOrder } from './types';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [dueDate, setDueDate] = useState("");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("NONE");

  const [actionError, setActionError] = useState("");

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch(() => setError("Failed to load tasks"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActionError("");

    try {
      if (editingTaskId !== null) {
        const updatedTask = await updateTask(editingTaskId, {
          title,
          description,
          status,
          dueDate,
        });
        
        setTasks((currentTasks) => 
          currentTasks.map((task) => 
            task.id === updatedTask.id ? updatedTask : task
           )
        );
  
        setEditingTaskId(null);
      } else {
        const newTask = await createTask({
          title,
          description,
          status,
          dueDate,
        });
    
        setTasks((currentTasks) => [...currentTasks, newTask]);
      }
     
      setTitle("");
      setDescription("");
      setStatus("TODO");
      setDueDate("");
    } catch {
      setActionError("Failed to save task. Please try again.");
    }
  }

  async function handleDelete(id: number) {
    setActionError("");

    try {
      await deleteTask(id);
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    } catch {
      setActionError("Failed to delete task. Please try again.");
    }
  }

  async function handleStatusChange(task: Task, newStatus: TaskStatus) {
    setActionError("");

    try {
      const updatedTask = await updateTask(task.id, {
        title: task.title,
        description: task.description,
        status: newStatus,
        dueDate: task.dueDate,
      });
  
      setTasks((currentTasks) => 
        currentTasks.map((currentTask) => 
          currentTask.id === updatedTask.id ? updatedTask : currentTask
        )
      );
    } catch {
      setActionError("Failed to update task status. Please try again.");
    }
  }

  function startEditing(task: Task) {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setDueDate(task.dueDate);
  }

  function cancelEditing() {
    setEditingTaskId(null);
    setTitle("");
    setDescription("");
    setStatus("TODO");
    setDueDate("");
  }

  if (loading) return <main className='app'>Loading tasks...</main>
  if (error) return <main className='app'>{error}</main>

  const filteredTasks = 
    statusFilter === "ALL"
      ? tasks
      : tasks.filter((task) => task.status === statusFilter);

  const visibleTasks = [...filteredTasks].sort((a, b) => {
    if (sortOrder === "NONE") return 0;

    const aTime = new Date(a.dueDate).getTime();
    const bTime = new Date(b.dueDate).getTime();

    return sortOrder === "DUE_ASC" ? aTime - bTime : bTime - aTime;
  });

  const taskSummary = 
    statusFilter === "ALL" 
      ? `Showing ${visibleTasks.length} tasks`
      : `Showing ${visibleTasks.length} of ${tasks.length} tasks`;
  
  return (
    <main className='app'>
      <h1>Task Manager</h1>
      <TaskToolbar 
        statusFilter={statusFilter}
        sortOrder={sortOrder}
        onStatusFilterChange={setStatusFilter}
        onSortOrderChange={setSortOrder}
      />

      <p className='task-summary'>{taskSummary}</p>

      <TaskForm
        title={title}
        description={description}
        status={status}
        dueDate={dueDate}
        isEditing={editingTaskId !== null}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onStatusChange={setStatus}
        onDueDateChange={setDueDate}
        onSubmit={handleSubmit}
        onCancel={cancelEditing}
      />

      {actionError && <p className='action-error'>{actionError}</p>}

      {visibleTasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <section className='task-list'>
          {visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={startEditing}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </section>
      )
    }
    </main>
  )
}

export default App;