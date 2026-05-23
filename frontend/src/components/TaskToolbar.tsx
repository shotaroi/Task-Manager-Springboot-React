import type { StatusFilter, SortOrder } from '../types';

interface TaskToolbarProps {
    statusFilter: StatusFilter;
    sortOrder: SortOrder;
    searchTerm: string;
    onStatusFilterChange: (value: StatusFilter) => void;
    onSortOrderChange: (value: SortOrder) => void;
    onSearchTermChange: (value: string) => void;
    onClearFilters: () => void;
}

export function TaskToolbar({
    statusFilter,
    sortOrder,
    searchTerm,
    onStatusFilterChange,
    onSortOrderChange,
    onSearchTermChange,
    onClearFilters,
}: TaskToolbarProps) {
    return (
        <>
          <input 
            className='search-input'
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder='Search tasks...'
          />
          <div className='filter-row'>
            {["ALL", "TODO", "IN_PROGRESS", "DONE"].map((value) => (
              <button
                key={value}  
                type='button'
                className={statusFilter === value ? "active" : ""}
                onClick={() => onStatusFilterChange(value as StatusFilter)}
              >
                {value === "ALL" ? "All" : value}
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
            <option value='DUE_DESC'>Due Date: latest first</option>
          </select>

          <button className='clear-filters-button' type='button' onClick={onClearFilters}>
            Clear Filters
          </button>
        </>
    );
}