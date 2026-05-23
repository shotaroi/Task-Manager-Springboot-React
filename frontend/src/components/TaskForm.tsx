import type { TaskStatus } from "../api/tasks";

interface TaskFormProps {
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: string;
    isEditing: boolean;
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onStatusChange: (value: TaskStatus) => void;
    onDueDateChange: (value: string) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
    isSaving: boolean;
}

export function TaskForm({
    title,
    description,
    status,
    dueDate,
    isEditing,
    onTitleChange,
    onDescriptionChange,
    onStatusChange,
    onDueDateChange,
    onSubmit,
    onCancel,
    isSaving,
}: TaskFormProps) {
    return (
        <form onSubmit={onSubmit} className='task-form'>
          <input 
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder='Task title'
            required
        />

        <textarea 
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder='Task description'
          required
        />

        <select 
          value={status}
          onChange={(event) => onStatusChange(event.target.value as TaskStatus)}
        >
          <option value='TODO'>TODO</option>
          <option value='IN_PROGRESS'>IN_PROGRESS</option>
          <option value='DONE'>DONE</option>
        </select>

        <input 
          type='date'
          value={dueDate}
          onChange={(event) => onDueDateChange(event.target.value)}
          required
        />

        <button type='submit' disabled={isSaving}>
            {isSaving ? "Saving..." : isEditing ? "Save Task" : "Add Task"}
        </button>

        {isEditing && (
            <button className='cancel-button' type='button' onClick={onCancel}>
                Cancel
            </button>
        )}
        </form>
    )
}