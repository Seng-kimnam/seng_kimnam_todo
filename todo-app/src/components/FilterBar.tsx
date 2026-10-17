export type FilterType = "all" | "active" | "completed";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface FilterBarProps {
  onFilterByComplete?: () => void;
  currentFilter?: FilterType;
  onFilterChange?: (filter: FilterType) => void;
  counts?: {
    all: number;
    active: number;
    completed: number;
  };
  onClearCompleted?: () => void;
  selectedLetter?: string;
  onLetterChange?: (letter: string) => void;
  availableLetters?: string[];
}

const FilterBar = ({
  onFilterByComplete,
  currentFilter = "all",
  onFilterChange,
  counts,
  onClearCompleted,
  selectedLetter = "",
  onLetterChange,
  availableLetters,
}: FilterBarProps) => {
  const handleTabClick = (filter: FilterType) => {
    if (onFilterChange) {
      onFilterChange(filter);
    } else if (filter === "completed" && onFilterByComplete) {
      onFilterByComplete();
    }
  };

  const tabs: { id: FilterType; label: string; count?: number }[] = [
    { id: "all", label: "All", count: counts?.all },
    { id: "active", label: "Active", count: counts?.active },
    { id: "completed", label: "Completed", count: counts?.completed },
  ];

  const isAvailable = (letter: string) =>
    !availableLetters || availableLetters.includes(letter);

  return (
    <div className="flex flex-col gap-3 py-2">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 w-full sm:w-auto justify-center sm:justify-start">
          {tabs.map((tab) => {
            const isActive = currentFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white"
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === "number" && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[11px] font-semibold ${
                      isActive
                        ? "bg-blue-700 text-white"
                        : "bg-white text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Clear completed button */}
        {counts && counts.completed > 0 && onClearCompleted && (
          <button
            onClick={onClearCompleted}
            className="text-xs text-slate-500 hover:text-slate-900 font-medium flex items-center gap-1.5 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer self-end sm:self-auto"
          >
            <svg
              className="w-3.5 h-3.5"
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
            <span>Clear completed</span>
          </button>
        )}
      </div>

      {/* Alphabet filter by title (dropdown) */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="letter-filter"
          className="text-xs font-medium text-slate-500"
        >
          Filter by title
        </label>
        <div className="relative">
          <select
            id="letter-filter"
            value={selectedLetter}
            onChange={(e) => onLetterChange && onLetterChange(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 focus:outline-none cursor-pointer"
          >
            <option value="">All letters</option>
            {ALPHABET.map((letter) => (
              <option
                key={letter}
                value={letter}
                disabled={!isAvailable(letter)}
              >
                {letter}
              </option>
            ))}
          </select>
          <svg
            className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
