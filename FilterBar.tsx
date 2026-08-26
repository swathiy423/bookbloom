import React, { useState } from 'react';
import { FilterState, BookFormatType } from '../types';
import { getAllGenres, getAllPublishers } from '../services/bookService';
import { Filter, X, Check, Share2, Sparkles, Building2, BookMarked, UserCheck } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  followedAuthorsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  followedAuthorsCount,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const genres = getAllGenres();
  const publishers = getAllPublishers();

  const activeFilterCount =
    (filters.genre ? 1 : 0) +
    (filters.publisher ? 1 : 0) +
    (filters.format !== 'all' ? 1 : 0) +
    (filters.onlyFollowedAuthors ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  const handleShareFilter = () => {
    const url = new URL(window.location.href);
    if (filters.genre) url.searchParams.set('genre', filters.genre);
    else url.searchParams.delete('genre');

    if (filters.publisher) url.searchParams.set('publisher', filters.publisher);
    else url.searchParams.delete('publisher');

    if (filters.format !== 'all') url.searchParams.set('format', filters.format);
    else url.searchParams.delete('format');

    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatOptions: { id: BookFormatType | 'all'; label: string }[] = [
    { id: 'all', label: 'All Formats' },
    { id: 'hardcover', label: 'Hardcover' },
    { id: 'paperback', label: 'Paperback' },
    { id: 'ebook', label: 'eBook' },
    { id: 'audiobook', label: 'Audiobook' },
  ];

  return (
    <div className="bg-[#ffffff] rounded-xl border border-[#e8e4dc] p-3.5 mb-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Top Filter Controls: Publisher, Format, Followed Authors & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#f0ede6]">
        <div className="flex flex-wrap items-center gap-2">
          {/* Format Selector Pills */}
          <div className="flex items-center bg-[#f5f4f0] p-0.5 rounded-lg border border-[#e8e4dc]">
            {formatOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onFilterChange({ format: opt.id })}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  filters.format === opt.id
                    ? 'bg-white text-[#1c1d22] shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Publisher / Imprint Dropdown */}
          <div className="relative inline-flex items-center">
            <Building2 className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none" />
            <select
              value={filters.publisher || ''}
              onChange={(e) => onFilterChange({ publisher: e.target.value || null })}
              aria-label="Filter by Publisher or Imprint"
              className="pl-8 pr-8 py-1.5 text-xs font-medium bg-[#f5f4f0] hover:bg-[#edeae3] text-neutral-800 rounded-lg border border-[#e8e4dc] focus:outline-hidden focus:ring-1 focus:ring-[#b85d38] appearance-none cursor-pointer"
            >
              <option value="">All Publishers ({publishers.length})</option>
              {publishers.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} ({p.count})
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 pointer-events-none text-[10px] text-neutral-400">▼</div>
          </div>

          {/* Followed Authors Filter Toggle */}
          {followedAuthorsCount > 0 && (
            <button
              onClick={() => onFilterChange({ onlyFollowedAuthors: !filters.onlyFollowedAuthors })}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filters.onlyFollowedAuthors
                  ? 'bg-[#eef5ee] text-[#2d6a4f] border border-[#c3dfc9] font-semibold'
                  : 'bg-[#f5f4f0] text-neutral-600 hover:text-neutral-900 border border-[#e8e4dc]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Followed Authors ({followedAuthorsCount})</span>
            </button>
          )}
        </div>

        {/* Right action group: Share view URL & Clear filters */}
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear filters ({activeFilterCount})</span>
            </button>
          )}

          <button
            onClick={handleShareFilter}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-700 bg-[#f5f4f0] hover:bg-neutral-200 border border-[#e8e4dc] rounded-md transition-colors"
            title="Copy shareable URL with active filters"
          >
            {copiedLink ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700 font-medium">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3 h-3 text-neutral-500" />
                <span>Share View</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Genre Horizontal Pill List */}
      <div className="pt-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 shrink-0 mr-1">
          Genres:
        </span>
        <button
          onClick={() => onFilterChange({ genre: null })}
          className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all ${
            filters.genre === null
              ? 'bg-[#1c1d22] text-white font-semibold'
              : 'bg-[#faf8f5] text-neutral-600 hover:bg-[#f0ebe1] border border-[#e8e4dc]'
          }`}
        >
          All Genres
        </button>

        {genres.map((g) => {
          const isSelected = filters.genre?.toLowerCase() === g.name.toLowerCase();
          return (
            <button
              key={g.name}
              onClick={() => onFilterChange({ genre: isSelected ? null : g.name })}
              className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#b85d38] text-white font-semibold shadow-xs'
                  : 'bg-[#faf8f5] text-neutral-700 hover:bg-[#f0ebe1] border border-[#e8e4dc]'
              }`}
            >
              <span>{g.name}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-neutral-200/60 text-neutral-500'
                }`}
              >
                {g.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
