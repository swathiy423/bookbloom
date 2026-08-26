import React, { useState } from 'react';
import { Book, BookFormat, FilterState } from '../types';
import { getBooksForMonth } from '../services/bookService';
import { FilterBar } from './FilterBar';
import { BookCard } from './BookCard';
import { BookCoverImage } from './BookCoverImage';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  X,
  BookOpen,
  Sparkles,
  BookMarked,
} from 'lucide-react';

interface CalendarViewProps {
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

export const CalendarView: React.FC<CalendarViewProps> = ({
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
  // Parse current date anchor
  const [initialYear, initialMonth] = currentDateStr.split('-').map(Number);
  const [viewYear, setViewYear] = useState<number>(initialYear);
  const [viewMonth, setViewMonth] = useState<number>(initialMonth - 1); // 0-11
  const [selectedDate, setSelectedDate] = useState<string | null>(currentDateStr);

  // Month data
  const monthMap = getBooksForMonth(viewYear, viewMonth, filters.genre, filters.publisher);

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

  const handleJumpToToday = () => {
    setViewYear(initialYear);
    setViewMonth(initialMonth - 1);
    setSelectedDate(currentDateStr);
  };

  // Calendar Grid Math
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarCells = [];

  // Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    calendarCells.push({
      dayNumber: dayNum,
      isCurrentMonth: false,
      dateStr: `${viewMonth === 0 ? viewYear - 1 : viewYear}-${String(viewMonth === 0 ? 12 : viewMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarCells.push({
      dayNumber: day,
      isCurrentMonth: true,
      dateStr,
    });
  }

  // Next month leading days to round out 35 or 42 grid cells
  const remaining = (7 - (calendarCells.length % 7)) % 7;
  for (let day = 1; day <= remaining; day++) {
    calendarCells.push({
      dayNumber: day,
      isCurrentMonth: false,
      dateStr: `${viewMonth === 11 ? viewYear + 1 : viewYear}-${String(viewMonth === 11 ? 1 : viewMonth + 2).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    });
  }

  // Selected date books
  const selectedDateReleases = selectedDate && monthMap[selectedDate] ? monthMap[selectedDate] : [];

  const formatSelectedDateHeading = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      return new Date(y, m - 1, d).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-6 border-b border-[#e8e4dc]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-[#b85d38] uppercase tracking-wider mb-1.5">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Monthly Release Calendar</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a1c20] tracking-tight">
            {monthName}
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Click any highlighted date with indicator dots to view all titles publishing on that day.
          </p>
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleJumpToToday}
            className="px-3 py-1.5 text-xs font-medium bg-[#f5f4f0] hover:bg-[#edeae3] text-neutral-800 rounded-lg border border-[#e8e4dc] transition-colors"
          >
            Jump to Today
          </button>
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
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
        followedAuthorsCount={followedAuthors.length}
      />

      {/* Main Grid + Selected Day Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Calendar Grid (8 cols on large screens) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-2xl border border-[#e8e4dc] p-4 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="py-2 text-xs font-mono font-medium text-neutral-400 uppercase">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarCells.map((cell) => {
              const releases = monthMap[cell.dateStr] || [];
              const hasReleases = releases.length > 0;
              const isToday = cell.dateStr === currentDateStr;
              const isSelected = cell.dateStr === selectedDate;

              return (
                <button
                  key={cell.dateStr}
                  onClick={() => cell.isCurrentMonth && setSelectedDate(cell.dateStr)}
                  disabled={!cell.isCurrentMonth}
                  className={`min-h-[72px] sm:min-h-[88px] p-1.5 sm:p-2 rounded-xl text-left flex flex-col justify-between transition-all border ${
                    !cell.isCurrentMonth
                      ? 'opacity-25 bg-neutral-50/50 border-transparent cursor-default'
                      : isSelected
                      ? 'bg-[#faf6f0] border-[#b85d38] ring-2 ring-[#b85d38]/20 shadow-xs'
                      : isToday
                      ? 'bg-[#faf8f5] border-[#b85d38]/40 shadow-xs'
                      : 'bg-white hover:bg-[#faf9f6] border-[#eeebe3]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-mono font-semibold rounded-md px-1.5 py-0.5 ${
                        isToday
                          ? 'bg-[#b85d38] text-white'
                          : isSelected
                          ? 'text-[#b85d38]'
                          : 'text-neutral-700'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>
                    {isToday && (
                      <span className="text-[9px] font-mono uppercase text-[#b85d38] font-bold hidden sm:inline">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Indicator Dots & Release Summary */}
                  {cell.isCurrentMonth && (
                    <div className="mt-1">
                      {hasReleases ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#b85d38] shrink-0" />
                            <span className="text-[11px] font-semibold text-neutral-800 line-clamp-1">
                              {releases.length} {releases.length === 1 ? 'book' : 'books'}
                            </span>
                          </div>
                          {/* Top release preview for desktop */}
                          <div className="hidden sm:block text-[10px] text-neutral-500 truncate">
                            {releases[0].book.title}
                          </div>
                        </div>
                      ) : (
                        <div className="h-2" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Releases Panel (4-5 cols on large screens) */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-6">
          <div className="bg-white rounded-2xl border border-[#e8e4dc] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-start justify-between pb-4 mb-4 border-b border-[#f0ede6]">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#b85d38]">
                  Selected Day Releases
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1a1c20] leading-tight">
                  {selectedDate ? formatSelectedDateHeading(selectedDate) : 'Select a date'}
                </h3>
              </div>
              {selectedDate && (
                <span className="px-2.5 py-1 text-xs font-mono font-semibold bg-[#f5f4f0] text-neutral-800 rounded-lg border border-[#e8e4dc]">
                  {selectedDateReleases.length} Titles
                </span>
              )}
            </div>

            {selectedDateReleases.length > 0 ? (
              <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                {selectedDateReleases.map(({ book, formats }) => (
                  <div
                    key={book.id}
                    className="p-3.5 bg-[#faf9f6] rounded-xl border border-[#ede9e1] hover:border-[#cfc9bd] transition-colors"
                  >
                    <div className="flex gap-3">
                      <div
                        className="w-16 shrink-0 cursor-pointer"
                        onClick={() => onOpenDetails(book)}
                      >
                        <BookCoverImage src={book.coverImage} title={book.title} author={book.author} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          {book.genreTags.slice(0, 2).map((g) => (
                            <span
                              key={g}
                              className="px-1.5 py-0.2 text-[10px] font-medium bg-white text-neutral-600 rounded border border-neutral-200"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                        <h4
                          onClick={() => onOpenDetails(book)}
                          className="font-serif text-sm font-bold text-neutral-900 leading-snug line-clamp-2 hover:text-[#b85d38] cursor-pointer"
                        >
                          {book.title}
                        </h4>
                        <p className="text-xs text-neutral-600 truncate mt-0.5">by {book.author}</p>
                        <p className="text-[11px] text-neutral-400 font-mono mt-0.5 truncate">
                          {book.publisher}
                        </p>

                        {/* Format badges releasing this day */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {formats.map((f) => (
                            <span
                              key={f.type}
                              className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#1c1d22] text-white"
                            >
                              {f.type.toUpperCase()} {f.price && `(${f.price})`}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick actions row */}
                    <div className="mt-3 pt-2.5 border-t border-[#ede9e1] flex items-center justify-between gap-1 flex-wrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onToggleStar(book.id)}
                          className={`text-xs font-medium flex items-center gap-1 ${
                            isStarred(book.id) ? 'text-[#d97706]' : 'text-neutral-600 hover:text-neutral-900'
                          }`}
                        >
                          <span>{isStarred(book.id) ? '★ Starred' : '☆ Remind Me'}</span>
                        </button>

                        <button
                          onClick={() => onToggleNotify && onToggleNotify(book.id)}
                          className={`text-xs font-medium flex items-center gap-1 ${
                            isNotified(book.id) ? 'text-[#d63384] font-semibold' : 'text-neutral-500 hover:text-pink-600'
                          }`}
                          title="Toggle release day notification"
                        >
                          <span>{isNotified(book.id) ? '🔔 Alert Set' : '🔔 Notify'}</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenCountdown(book.isbn)}
                          className="text-xs font-medium text-neutral-600 hover:text-neutral-900"
                        >
                          Countdown
                        </button>
                        <button
                          onClick={() => onOpenDetails(book)}
                          className="text-xs font-semibold text-[#b85d38] hover:underline"
                        >
                          Details →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-neutral-400">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-medium">No releases recorded on this date</p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Try clicking a date with indicator dots on the grid.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
