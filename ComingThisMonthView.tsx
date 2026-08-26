import React, { useState } from 'react';
import { Book, FilterState, WeeklyDigestGroup } from '../types';
import { getWeeklyDigests, formatWeekAsPlainText } from '../services/bookService';
import { FilterBar } from './FilterBar';
import { BookCard } from './BookCard';
import {
  ListFilter,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Share2,
} from 'lucide-react';

interface ComingThisMonthViewProps {
  currentDateStr: string; // e.g. "2026-08-26"
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  followedAuthors: string[];
  isStarred: (id: string) => boolean;
  onToggleStar: (id: string) => void;
  isAnticipated: (id: string) => boolean;
  onToggleAnticipate: (id: string) => void;
  isAuthorFollowed: (author: string) => boolean;
  onToggleFollowAuthor: (author: string) => void;
  onOpenDetails: (book: Book) => void;
  onOpenCountdown: (isbn: string) => void;
  isNotified?: (id: string) => boolean;
  onToggleNotify?: (id: string) => void;
}

export const ComingThisMonthView: React.FC<ComingThisMonthViewProps> = ({
  currentDateStr,
  filters,
  onFilterChange,
  onResetFilters,
  followedAuthors,
  isStarred,
  onToggleStar,
  isAnticipated,
  onToggleAnticipate,
  isAuthorFollowed,
  onToggleFollowAuthor,
  onOpenDetails,
  onOpenCountdown,
  isNotified = (_id: string) => false,
  onToggleNotify,
}) => {
  const [initialYear, initialMonth] = currentDateStr.split('-').map(Number);
  const [viewYear, setViewYear] = useState<number>(initialYear);
  const [viewMonth, setViewMonth] = useState<number>(initialMonth - 1); // 0-11
  const [copiedWeekIndex, setCopiedWeekIndex] = useState<number | null>(null);

  const weeklyGroups = getWeeklyDigests(viewYear, viewMonth, filters.genre, filters.publisher);

  const monthName = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleCopyWeek = (group: WeeklyDigestGroup, index: number) => {
    const text = formatWeekAsPlainText(group);
    navigator.clipboard.writeText(text);
    setCopiedWeekIndex(index);
    setTimeout(() => setCopiedWeekIndex(null), 2500);
  };

  const totalBooksInMonth = weeklyGroups.reduce((acc, g) => acc + g.books.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-6 border-b border-[#e8e4dc]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-[#b85d38] uppercase tracking-wider mb-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Coming This Month Digest</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a1c20] tracking-tight">
            {monthName} Releases by Week
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Weekly roadmap of all scheduled hardcover, paperback, audio, and digital arrivals ({totalBooksInMonth} titles).
          </p>
        </div>

        {/* Month Switcher */}
        <div className="flex items-center bg-white rounded-lg border border-[#e8e4dc] p-0.5">
          <button
            onClick={handlePrevMonth}
            aria-label="Previous Month"
            className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 text-xs font-mono font-semibold text-neutral-800 min-w-[110px] text-center">
            {monthName.split(' ')[0]} {viewYear}
          </span>
          <button
            onClick={handleNextMonth}
            aria-label="Next Month"
            className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
        followedAuthorsCount={followedAuthors.length}
      />

      {/* Week Quick Jump Navigator */}
      <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-mono text-neutral-400 uppercase shrink-0">Jump to:</span>
        {weeklyGroups.map((group, idx) => (
          <a
            key={group.weekNumber}
            href={`#week-${group.weekNumber}`}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-[#faf6f0] border border-[#e8e4dc] text-neutral-700 shrink-0 transition-colors flex items-center gap-1.5"
          >
            <span className="font-semibold">Week {group.weekNumber}</span>
            <span className="text-[10px] font-mono text-neutral-400">({group.books.length})</span>
          </a>
        ))}
      </div>

      {/* Weekly Sections */}
      <div className="space-y-12">
        {weeklyGroups.map((group, idx) => (
          <section
            key={group.weekNumber}
            id={`week-${group.weekNumber}`}
            className="scroll-mt-24"
          >
            {/* Section Header with "Copy This Week's Releases" Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b-2 border-[#1c1d22]">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#1c1d22] text-white flex items-center justify-center font-mono font-bold text-xs">
                  W{group.weekNumber}
                </span>
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1a1c20]">
                    {group.weekLabel}
                  </h2>
                  <span className="text-xs text-neutral-500 font-mono">
                    {group.books.length} scheduled titles releasing
                  </span>
                </div>
              </div>

              {/* Copy plain text button for Substack / BookTok / Newsletters */}
              <button
                onClick={() => handleCopyWeek(group, idx)}
                disabled={group.books.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#faf8f5] hover:bg-[#f0ebe1] text-neutral-800 border border-[#e8e4dc] transition-all disabled:opacity-40"
                title="Format and copy this week's titles as plain text for social media or newsletters"
              >
                {copiedWeekIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">Copied Digest to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Copy Week's Digest (Plain Text)</span>
                  </>
                )}
              </button>
            </div>

            {/* Books in this week */}
            {group.books.length > 0 ? (
              <div className="space-y-4">
                {group.books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    isStarred={isStarred(book.id)}
                    onToggleStar={onToggleStar}
                    isAnticipated={isAnticipated(book.id)}
                    onToggleAnticipate={onToggleAnticipate}
                    isAuthorFollowed={isAuthorFollowed(book.author)}
                    onToggleFollowAuthor={onToggleFollowAuthor}
                    isNotified={isNotified(book.id)}
                    onToggleNotify={onToggleNotify}
                    onOpenDetails={onOpenDetails}
                    onOpenCountdown={onOpenCountdown}
                    highlightDate={currentDateStr}
                    selectedFormat={filters.format}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 px-4 text-center bg-white rounded-xl border border-dashed border-[#e8e4dc] text-neutral-400">
                <p className="text-xs">No matching titles scheduled for this week with current filters.</p>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};
