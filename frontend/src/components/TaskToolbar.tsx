import type { TaskStatus } from "../api/tasks";

type StatusFilter = TaskStatus | "ALL";
type SortOrder = "NONE" | "DUE_ASC" | "DUE_DESC";

interface TaskToolbarProps {
    statusFilter: StatusFilter;
    sortOrder: SortOrder;
    onStatusFilterChange: (value: StatusFilter) => void;
    onSortOrderChange: (value: SortOrder) => void;
}

export function TaskToolbar({
    statusFilter,
    sortOrder,
    onStatusFilterChange,
    onSortOrderChange,
}: TaskToolbarProps) {
    return (
        <>
          <div className='filter-row'>
            {["ALL", "TODO", "IN_PROGRESS", "DONE"].map((value) => (
              <button
                key={value}  
                type='button'
                className={statusFilter === value ? "active" : ""}
                onClick={() => onStatusFilterChange(value as StatusFilter)}
              >
                {value === "ALL" ? "ALL" : value}
              </button>
            ))}
          </div>

          <select 
            className='sort-select'
            value={sortOrder}
            onChange={(event) => onSortOrderChange(event.target.value as SortOrder)}
          >
            <option value='NONE'>No Sorting</option>
            <option value='DUE_ASC'>Due Date: earliest first</option>
            <option value='DUE_DESC'>Due Date: altest first</option>
          </select>
        </>
    );
}