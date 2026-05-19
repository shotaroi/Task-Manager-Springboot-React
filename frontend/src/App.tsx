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

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [dueDate, setDueDate] = useState("");

  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch(() => setError("Failed to load tasks"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newTask = await createTask({
      title,
      description,
      status,
      dueDate,
    });

    setTasks((currentTasks) => [...currentTasks, newTask]);
    setTitle("");
    setDescription("");
    setStatus("TODO");
    setDueDate("");
  }

  async function handleDelete(id: number) {
    await deleteTask(id);
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }

  async function handleStatusChange(task: Task, newStatus: TaskStatus) {
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
  }

  if (loading) return <main className='app'>Loading tasks...</main>
  if (error) return <main className='app'>{error}</main>

  const filteredTasks = 
    statusFilter === "ALL"
      ? tasks
      : tasks.filter((task) => task.status === statusFilter);
  
  return (
    <main className='app'>
      <h1>Task Manager</h1>
      <div className='filter-row'>
        <button type='button' onClick={() => setStatusFilter("ALL")}>All</button>
        <button type='button' onClick={() => setStatusFilter("TODO")}>TODO</button>
        <button type='button' onClick={() => setStatusFilter("IN_PROGRESS")}>IN_PROGRESS</button>
        <button type='button' onClick={() => setStatusFilter("DONE")}>DONE</button>
      </div>
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

        <button type='submit'>Add Task</button>
      </form>

      {filteredTasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <section className='task-list'>
          {filteredTasks.map((task) => (
            <article className='task-card' key={task.id}>
              <h2>{task.title}</h2>
              <p>{task.description}</p>
             
              <select 
                className='status-select'
                value={task.status}
                onChange={(event) => handleStatusChange(task, event.target.value as TaskStatus)}
              >
                <option value='TODO'>TODO</option>
                <option value='IN_PROGRESS'>IN_PROGRESS</option>
                <option value='DONE'>DONE</option>
              </select>
             
              <small>Due: {task.dueDate}</small>
              <button
                type='button'
                className='delete-button'
                onClick={() => handleDelete(task.id)}
              >
                Delete
              </button>
            </article>
          ))}
        </section>
      )
    }
    </main>
  )
}

export default App;