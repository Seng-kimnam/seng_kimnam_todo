import { useState } from "react";
import type { Todo } from "@/api/todos";

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  onEditTodo: (id: number, title: string) => void;
  onBulkDelete: (ids: number[]) => void;
  onBulkSetStatus: (ids: number[], isCompleted: boolean) => void;
}

const TodoList = ({
  todos,
  onToggleTodo,
  onDeleteTodo,
  onEditTodo,
  onBulkDelete,
  onBulkSetStatus,
}: TodoListProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const selected = selectedIds.filter((id) => todos.some((t) => t.id === id));

  function startEditing(todo: Todo) {
    setEditingId(todo.id);
    setEditText(todo.title);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditText("");
  }

  function saveEditing(id: number) {
    if (onEditTodo && editText.trim()) {
      onEditTodo(id, editText);
    }
    cancelEditing();
  }

  const allSelected = todos.length > 0 && selected.length === todos.length;

  function toggleSelect(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function toggleSelectAll() {
    setSelectedIds(allSelected ? [] : todos.map((t) => t.id));
  }

  function bulkDelete() {
    if (onBulkDelete) onBulkDelete(selected);
    setSelectedIds([]);
  }

  function bulkSetStatus(isCompleted: boolean) {
    if (onBulkSetStatus) onBulkSetStatus(selected, isCompleted);
    setSelectedIds([]);
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-white border border-slate-200 mt-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 mb-4">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">
          No tasks found
        </h3>
        <p className="text-sm text-slate-500 max-w-sm">
          Everything is cleared! Take a breather or add a new task above to stay
          productive.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-3 mb-3 px-1">
        <label className="flex items-center gap-2 text-xs font-medium text-slate-500 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer"
          />
          Select all
        </label>
        {selected.length > 0 && (
          <span className="text-xs font-semibold text-blue-600">
            {selected.length} selected
          </span>
        )}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 mb-3 rounded-2xl bg-blue-50 border border-blue-200">
          <span className="text-sm font-semibold text-blue-700">
            {selected.length} {selected.length === 1 ? "task" : "tasks"} selected
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => bulkSetStatus(true)}
              className="px-3 py-1.5 rounded-xl text-xs cursor-pointer font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              Mark complete
            </button>
            <button
              type="button"
              onClick={() => bulkSetStatus(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer text-white bg-slate-600 hover:bg-slate-700 transition-colors"
            >
              Mark incomplete
            </button>
            <button
              type="button"
              onClick={bulkDelete}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-white transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {todos.map((todo) => {
          const isEditing = editingId === todo.id;
          const isSelected = selected.includes(todo.id);
          const isCompleted = todo.status === "DONE";

          return (
            <div
              key={todo.id}
              onClick={() => !isEditing && onToggleTodo(todo.id)}
              className={`group flex items-center justify-between p-4 rounded-2xl border bg-white transition-all duration-200 ${
                isSelected
                  ? "border-blue-300 ring-2 ring-blue-500/20"
                  : "border-slate-200 hover:border-blue-200"
              } ${isEditing ? "cursor-default" : "cursor-pointer"}`}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <input
                  type="checkbox"
                  aria-label="Select task"
                  checked={isSelected}
                  disabled={isEditing}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleSelect(todo.id)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer shrink-0"
                />

                <button
                  type="button"
                  aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
                  disabled={isEditing}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTodo(todo.id);
                  }}
                  className={`w-6 h-6 cursor-pointer rounded-lg flex items-center justify-center transition-all duration-150 shrink-0 ${
                    isCompleted
                      ? "bg-blue-600 text-white"
                      : "border-2 border-slate-300 group-hover:border-blue-400 bg-white"
                  }`}
                >
                  {isCompleted && (
                    <svg
                      className="w-4 h-4 stroke-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      autoFocus
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          saveEditing(todo.id);
                        }
                        if (e.key === "Escape") cancelEditing();
                      }}
                      className="w-full px-3 py-1.5 bg-white text-slate-900 text-sm rounded-lg border border-blue-300 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                    />
                  ) : (
                    <p
                      className={`text-sm sm:text-base wrap-text transition-all duration-150 select-none ${
                        isCompleted
                          ? "line-through text-slate-400"
                          : "text-slate-700"
                      }`}
                    >
                      {todo.title}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 ml-3">
                <span
                  className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    isCompleted
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-blue-100 text-blue-700 border border-blue-200"
                  }`}
                >
                  {isCompleted ? "Done" : "In Progress"}
                </span>

                {isEditing ? (
                  <>
                    <button
                      type="button"
                      aria-label="Save task"
                      onClick={(e) => {
                        e.stopPropagation();
                        saveEditing(todo.id);
                      }}
                      className="p-2 rounded-xl text-green-600 hover:text-green-700 hover:bg-slate-100 transition-all duration-150"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      aria-label="Cancel edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelEditing();
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all duration-150"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      aria-label="Edit task"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(todo);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all duration-150"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zM19.5 7.125L16.875 4.5"
                        />
                      </svg>
                    </button>

                    <button
                      type="button"
                      aria-label="Delete task"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTodo(todo.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all duration-150"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodoList;
