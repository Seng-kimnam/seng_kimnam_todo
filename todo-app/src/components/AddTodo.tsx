interface AddTodoProps {
  newTodoText: string;
  setNewTodoText: (text: string) => void;
  handleAddTodoItem: (context: React.FormEvent<HTMLFormElement>) => void;
}

const AddTodo = ({
  newTodoText,
  setNewTodoText,
  handleAddTodoItem,
}: AddTodoProps) => {
  return (
    <form
      onSubmit={handleAddTodoItem}
      className="relative flex items-center group w-full"
    >
      <div className="relative flex-1 flex items-center">
        {/* Left icon */}
        <div className="absolute left-4 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>

        {/* Text input */}
        <input
          type="text"
          placeholder="What do you need to accomplish today?..."
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          className="w-full pl-12 pr-28 py-3.5 bg-white text-slate-900 placeholder-slate-400 text-sm sm:text-base rounded-2xl border border-slate-200 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 focus:outline-none shadow-sm transition-all duration-300"
        />

        {/* Enter key badge */}
        <div className="absolute right-24 hidden lg:flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 pointer-events-none">
          <span>↵</span>
          <span>Enter</span>
        </div>

        {/* Add button */}
        <button
          type="submit"
          disabled={!newTodoText.trim()}
          className="absolute right-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium text-sm flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:active:scale-100 transition-all duration-150"
        >
          <span>Add</span>
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default AddTodo;
