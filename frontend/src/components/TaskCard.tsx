import type { Task, TaskStatus } from "../api/tasks";

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: number) => void;
    onStatusChange: (task: Task, status: TaskStatus) => void;
}

export function TaskCard({
    task,
    onEdit,
    onDelete,
    onStatusChange,
}: TaskCardProps) {
    return (
        <article className='task-card'>
            <h2>{task.title}</h2>
            <p>{task.description}</p>

            <select 
              className='status-select'
              value={task.status}  
              onChange={(event) => onStatusChange(task, event.target.value as TaskStatus)}
            >
              <option value='TODO'>TODO</option>
              <option value='IN_PROGRESS'>IN_PROGRESS</option>
              <option value='DONE'>DONE</option>
            </select>

            <small>Due: {task.dueDate}</small>

            <button className='edit-button' type='button' onClick={() => onEdit(task)}>
                Edit
            </button>

            <button 
              className='delete-button'
              type='button'  
              onClick={() => onDelete(task.id)}
            >
                Delete
            </button>
        </article>
    );
}
