import AddTodo from "@/components/AddTodo";
import FilterBar, { type FilterType } from "@/components/FilterBar";
import TodoList from "@/components/TodoList";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";

export interface TodoObject {
  id: number;
  text: string;
  isCompleted: boolean;
  isPriority?: boolean;
}

const initialTodos: TodoObject[] = [
  {
    id: 1,
    text: "Install Node",
    isCompleted: true,
  },
  {
    id: 2,
    text: "Learn React state management",
    isCompleted: false,
  },
  {
    id: 3,
    text: "Create React components",
    isCompleted: true,
  },
  {
    id: 4,
    text: "Practice props and callbacks",
    isCompleted: false,
  },
  {
    id: 5,
    text: "Learn useEffect",
    isCompleted: false,
  },
  {
    id: 6,
    text: "Build a Todo application",
    isCompleted: true,
  },
  {
    id: 7,
    text: "Practice TypeScript with React",
    isCompleted: false,
  },
];

const TodoPage = () => {
  const { user } = useAuth();
  const storageKey = user ? `todo_app_todos_${user.id}` : null;

  const [todos, setTodos] = useState<TodoObject[]>(() => {
    if (!storageKey) return initialTodos;
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as TodoObject[]) : initialTodos;
    } catch {
      return initialTodos;
    }
  });
  const [newTodoText, setNewTodoText] = useState<string>("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [letter, setLetter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(todos));
  }, [todos, storageKey]);

  function addTodo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    const newTodo: TodoObject = {
      id: Date.now(),
      text: newTodoText.trim(),
      isCompleted: false,
      isPriority: false,
    };
    setTodos([newTodo, ...todos]);
    setNewTodoText("");
  }

  function toggleTodo(id: number) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo,
      ),
    );
  }

  function deleteTodo(id: number) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function editTodo(id: number, text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: trimmed } : todo)),
    );
  }

  function togglePriority(id: number) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isPriority: !todo.isPriority } : todo,
      ),
    );
  }

  function handleFilterByComplete() {
    setFilter("completed");
  }

  function clearCompleted() {
    setTodos(todos.filter((todo) => !todo.isCompleted));
  }

  function bulkDeleteTodos(ids: number[]) {
    setTodos(todos.filter((todo) => !ids.includes(todo.id)));
  }

  function bulkSetStatus(ids: number[], isCompleted: boolean) {
    setTodos(
      todos.map((todo) =>
        ids.includes(todo.id) ? { ...todo, isCompleted } : todo,
      ),
    );
  }

  function reorderTodos(orderedVisible: TodoObject[]) {
    const visibleIds = new Set(orderedVisible.map((t) => t.id));
    const queue = [...orderedVisible];
    setTodos(todos.map((todo) => (visibleIds.has(todo.id) ? queue.shift()! : todo)));
  }

  // Filter calculations
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.isCompleted).length;
  const activeCount = totalCount - completedCount;
  const completionPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active" && todo.isCompleted) return false;
    if (filter === "completed" && !todo.isCompleted) return false;
    if (letter && todo.text.trim().charAt(0).toUpperCase() !== letter) {
      return false;
    }
    return true;
  });

  const availableLetters = [
    ...new Set(
      todos
        .map((todo) => todo.text.trim().charAt(0).toUpperCase())
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
                {user ? `${user.username}'s Tasks` : "Stay Productive Today"}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage your priorities and build momentum one task at a time.
              </p>
            </div>

            {/* Quick Stat Pill */}
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

          {/* Progress Bar (Single solid blue color, no gradient) */}
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

        {/* Add Todo Input */}
        <AddTodo
          newTodoText={newTodoText}
          setNewTodoText={setNewTodoText}
          handleAddTodoItem={addTodo}
        />

        {/* Filter and Action Bar */}
        <FilterBar
          onFilterByComplete={handleFilterByComplete}
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

        {/* Search Input */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* List of Tasks */}
        <TodoList
          todos={filteredTodos}
          onToggleTodo={toggleTodo}
          onDeleteTodo={deleteTodo}
          onEditTodo={editTodo}
          onBulkDelete={bulkDeleteTodos}
          onBulkSetStatus={bulkSetStatus}
          onReorder={reorderTodos}
          onTogglePriority={togglePriority}
        />
      </div>
    </div>
  );
};

export default TodoPage;
