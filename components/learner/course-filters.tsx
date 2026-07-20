'use client';

import { Search, Sliders } from 'lucide-react';

interface CourseFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  levelFilter: string;
  onLevelChange: (level: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
}

const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const categories = ['All Categories', 'Security', 'Hacking', 'Networks', 'Compliance', 'Forensics', 'Administration'];

export default function CourseFilters({
  searchTerm,
  onSearchChange,
  levelFilter,
  onLevelChange,
  categoryFilter,
  onCategoryChange,
}: CourseFiltersProps) {
  return (
    <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
      {/* Search */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Search Courses</label>
        <div className="relative">
          <Search className="absolute left-3 top-3 size-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by title, topic..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-2xl bg-slate-800 py-2 pl-10 pr-4 text-slate-100 placeholder-slate-500 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* Level Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Difficulty Level</label>
        <div className="grid grid-cols-2 gap-2">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => onLevelChange(level === 'All Levels' ? 'all' : level)}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                (level === 'All Levels' ? levelFilter === 'all' : levelFilter === level)
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Category</label>
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full rounded-2xl bg-slate-800 px-4 py-2 text-slate-100 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat === 'All Categories' ? '' : cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
