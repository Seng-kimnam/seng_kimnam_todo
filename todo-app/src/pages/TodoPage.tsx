import AddTodo from "@/components/AddTodo";
import FilterBar, { type FilterType } from "@/components/FilterBar";
import TodoList from "@/components/TodoList";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  type Todo,
  type TodoStatus,
} from "@/api/todos";
import { ApiError } from "@/api/client";
import { useEffect, useState } from "react";

const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTodoText, setNewTodoText] = useState<string>("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [letter, setLetter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        if (!active) return;
        setLoading(true);
        const data = await getTodos();
        if (active) {
          setTodos(data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof ApiError ? err.message : "Something went wrong.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    void fetchData();
    return () => {
      active = false;
    };
  }, []);

  function reportError(err: unknown) {
    setError(err instanceof ApiError ? err.message : "Something went wrong.");
  }

  async function addTodo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const title = newTodoText.trim();
    if (!title) return;
    try {
      const created = await createTodo(title);
      setTodos((prev) => [created, ...prev]);
      setNewTodoText("");
    } catch (err) {
      reportError(err);
    }
  }

  async function toggleTodo(id: number) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    const status: TodoStatus = todo.status === "DONE" ? "TODO" : "DONE";
    try {
      const updated = await updateTodo(id, { status });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      reportError(err);
    }
  }

  async function editTodo(id: number, title: string) {
    const trimmed = title.trim();
    if (!trimmed) return;
    try {
      const updated = await updateTodo(id, { title: trimmed });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      reportError(err);
    }
  }

  async function removeTodo(id: number) {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      reportError(err);
    }
  }

  async function bulkDeleteTodos(ids: number[]) {
    try {
      await Promise.all(ids.map((id) => deleteTodo(id)));
      setTodos((prev) => prev.filter((t) => !ids.includes(t.id)));
    } catch (err) {
      reportError(err);
    }
  }

  async function bulkSetStatus(ids: number[], isCompleted: boolean) {
    const status: TodoStatus = isCompleted ? "DONE" : "TODO";
    try {
      const results = await Promise.all(
        ids.map((id) => updateTodo(id, { status })),
      );
      const map = new Map<number, Todo>();
      for (const t of results) {
        map.set(t.id, t);
      }
      setTodos((prev) => prev.map((t) => map.get(t.id) ?? t));
    } catch (err) {
      reportError(err);
    }
  }

  function clearCompleted() {
    const ids = todos.filter((t) => t.status === "DONE").map((t) => t.id);
    if (ids.length) void bulkDeleteTodos(ids);
  }

  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.status === "DONE").length;
  const activeCount = totalCount - completedCount;
  const completionPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const query = searchQuery.trim().toLowerCase();
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active" && todo.status === "DONE") return false;
    if (filter === "completed" && todo.status !== "DONE") return false;
    if (letter && todo.title.trim().charAt(0).toUpperCase() !== letter) {
      return false;
    }
    if (query && !todo.title.toLowerCase().includes(query)) {
      return false;
    }
    return true;
  });

  const availableLetters = [
    ...new Set(
      todos
        .map((todo) => todo.title.trim().charAt(0).toUpperCase())
        .filter((c) => /[A-Z]/.test(c)),
    ),
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-600 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Task Manager
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Your Tasks
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage your priorities and build momentum one task at a time.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 border text-slate-900 border-slate-200 rounded-2xl p-3.5 px-4 self-start sm:self-auto">
              <div className="text-center">
                <div className="text-xl font-bold ">
                  {completedCount}/{totalCount}
                </div>
                <div className="text-[11px]  uppercase tracking-wider font-medium">
                  Completed
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {completionPercentage}%
                </div>
                <div className="text-[11px]  uppercase tracking-wider font-medium">
                  Rate
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-xs  mb-1.5 font-medium">
              <span className="text-slate-600">Task Completion</span>
              <span className="text-blue-600 font-semibold">
                {completedCount} of {totalCount} done
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="rounded-2xl bg-white border border-slate-200 px-4 py-3 text-sm text-slate-600">
            Loading tasks...
          </div>
        )}

        <AddTodo
          newTodoText={newTodoText}
          setNewTodoText={setNewTodoText}
          handleAddTodoItem={addTodo}
        />

        <FilterBar
          onFilterByComplete={() => setFilter("completed")}
          currentFilter={filter}
          onFilterChange={setFilter}
          counts={{
            all: totalCount,
            active: activeCount,
            completed: completedCount,
          }}
          onClearCompleted={clearCompleted}
          selectedLetter={letter}
          onLetterChange={setLetter}
          availableLetters={availableLetters}
        />

        <div className="mt-4">
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <TodoList
          todos={filteredTodos}
          onToggleTodo={toggleTodo}
          onDeleteTodo={removeTodo}
          onEditTodo={editTodo}
          onBulkDelete={bulkDeleteTodos}
          onBulkSetStatus={bulkSetStatus}
        />
      </div>
    </div>
  );
};

export default TodoPage;
