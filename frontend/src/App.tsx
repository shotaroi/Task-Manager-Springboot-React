import { useEffect, useState } from "react";
import "./App.css";
import { createTask, getTasks, type Task, type TaskStatus } from "./api/tasks";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [dueDate, setDueDate] = useState("");

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

  if (loading) return <main className='app'>Loading tasks...</main>
  if (error) return <main className='app'>{error}</main>

  return (
    <main className='app'>
      <h1>Task Manager</h1>
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

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <section className='task-list'>
          {tasks.map((task) => (
            <article className='task-card' key={task.id}>
              <h2>{task.title}</h2>
              <p>{task.description}</p>
              <span>{task.status}</span>
              <small>Due: {task.dueDate}</small>
            </article>
          ))}
        </section>
      )
    }
    </main>
  )
}

export default App;