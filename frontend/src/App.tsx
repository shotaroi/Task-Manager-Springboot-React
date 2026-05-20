import { useEffect, useState } from "react";
import "./App.css";
import { TaskCard } from "./components/TaskCard";
import { 
  createTask,
  getTasks,
  deleteTask,
  updateTask,
  type Task, 
  type TaskStatus,
} from "./api/tasks";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [dueDate, setDueDate] = useState("");

  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"NONE" | "DUE_ASC" | "DUE_DESC">("NONE");

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
  
  return (
    <main className='app'>
      <h1>Task Manager</h1>
      <div className='filter-row'>
        <button type='button' className={statusFilter === "ALL" ? "active" : ""} onClick={() => setStatusFilter("ALL")}>All</button>
        <button type='button' className={statusFilter === "TODO" ? "active" : ""} onClick={() => setStatusFilter("TODO")}>TODO</button>
        <button type='button' className={statusFilter === "IN_PROGRESS" ? "active" : ""} onClick={() => setStatusFilter("IN_PROGRESS")}>IN_PROGRESS</button>
        <button type='button' className={statusFilter === "DONE" ? "active" : ""} onClick={() => setStatusFilter("DONE")}>DONE</button>
      </div>

      <select 
        className='sort-select'
        value={sortOrder}  
        onChange={(event) => setSortOrder(event.target.value as "NONE" | "DUE_ASC" | "DUE_DESC")}
      >
        <option value='NONE'>No Sorting</option>
        <option value='DUE_ASC'>Due Date: earliest first</option>
        <option value='DUE_DESC'>Due Date: latest first</option>
      </select>

      <form onSubmit={handleSubmit} className='task-form'>
        <input 
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder='Task title'
          required
        />

        <textarea 
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder='Task description'
          required
        />

        <select 
          value={status}
          onChange={(event) => setStatus(event.target.value as TaskStatus)}
        >
          <option value='TODO'>TODO</option>
          <option value='IN_PROGRESS'>IN_PROGRESS</option>
          <option value='DONE'>DONE</option>
        </select>

        <input 
          type='date'
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          required
        />

        <button type='submit'>
          {editingTaskId === null ? "Add Task" : "Save Task"}
        </button>

        {editingTaskId != null && (
          <button className='cancel-button' type='button' onClick={cancelEditing}>
            Cancel
          </button>
        )}
      </form>

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