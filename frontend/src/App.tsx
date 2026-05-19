import { useEffect, useState } from "react";
import "./App.css";
import { getTasks, type Task } from "./api/tasks";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch(() => setError("Failed to load tasks"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main className='app'>Loading tasks...</main>
  if (error) return <main className='app'>{error}</main>

  return (
    <main className='app'>
      <h1>Task Manager</h1>

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <section className='task-list'>
          {tasks.map((task) => (
            <article className='task-card' key={task.id}>
              <h2>{task.title}</h2>
              <p>{task.description}</p>
              <span>P{task.status}</span>
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