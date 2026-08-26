import React, { useState } from 'react';
import { Book, BookFormatType } from '../types';
import { BookCoverImage } from './BookCoverImage';
import { notificationService } from '../services/notificationService';
import { sound } from '../utils/soundEffects';
import {
  Star,
  Flame,
  ExternalLink,
  Hourglass,
  Copy,
  Check,
  Bookmark,
  Volume2,
  BookMarked,
  FileText,
  Headphones,
  UserCheck,
  UserPlus,
  Bell,
  BellRing,
} from 'lucide-react';

interface BookCardProps {
  book: Book;
  isStarred: boolean;
  onToggleStar: (bookId: string) => void;
  isAnticipated: boolean;
  onToggleAnticipate: (bookId: string) => void;
  isAuthorFollowed: boolean;
  onToggleFollowAuthor: (author: string) => void;
  onOpenDetails: (book: Book) => void;
  onOpenCountdown: (isbn: string) => void;
  isNotified?: boolean;
  onToggleNotify?: (bookId: string) => void;
  highlightDate?: string; // If specified, highlights formats releasing on this date
  selectedFormat?: BookFormatType | 'all';
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  isStarred,
  onToggleStar,
  isAnticipated,
  onToggleAnticipate,
  isAuthorFollowed,
  onToggleFollowAuthor,
  onOpenDetails,
  onOpenCountdown,
  isNotified = false,
  onToggleNotify,
  highlightDate,
  selectedFormat = 'all',
}) => {
  const [copiedIsbn, setCopiedIsbn] = useState(false);

  const handleToggleNotify = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playSparkle();
    if (onToggleNotify) {
      onToggleNotify(book.id);
    }
  };

  const handleSimulateAlert = (e: React.MouseEvent) => {
    e.stopPropagation();
    notificationService.triggerReleaseDayNotification(book, highlightDate || book.primaryReleaseDate, true);
  };

  const handleCopyIsbn = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(book.isbn);
    setCopiedIsbn(true);
    setTimeout(() => setCopiedIsbn(false), 2000);
  };

  const getFormatIcon = (type: BookFormatType) => {
    switch (type) {
      case 'hardcover':
        return <BookMarked className="w-3 h-3" />;
      case 'paperback':
        return <Bookmark className="w-3 h-3" />;
      case 'ebook':
        return <FileText className="w-3 h-3" />;
      case 'audiobook':
        return <Headphones className="w-3 h-3" />;
    }
  };

  const formatLabels: Record<BookFormatType, string> = {
    hardcover: 'Hardcover',
    paperback: 'Paperback',
    ebook: 'eBook',
    audiobook: 'Audiobook',
  };

  // Format date helper: "Aug 26"
  const formatShortDate = (isoDate: string) => {
    try {
      const [year, month, day] = isoDate.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return isoDate;
    }
  };

  const totalAnticipation = book.anticipatedCount + (isAnticipated ? 1 : 0);

  return (
    <article
      id={`book-card-${book.id}`}
      className="group relative bg-[#ffffff] rounded-xl border border-[#e8e4dc] hover:border-[#cfc9bd] transition-all duration-200 overflow-hidden flex flex-col md:flex-row shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
    >
      {/* Left Column: Book Jacket Cover */}
      <div
        className="w-full md:w-48 lg:w-52 shrink-0 p-4 pb-0 md:pb-4 flex flex-col items-center md:items-start cursor-pointer"
        onClick={() => onOpenDetails(book)}
      >
        <div className="w-36 md:w-full relative group/cover">
          <BookCoverImage src={book.coverImage} title={book.title} author={book.author} />
          
          {/* Quick countdown badge on cover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenCountdown(book.isbn);
            }}
            className="absolute bottom-2 left-2 right-2 py-1 px-2 bg-[#1c1d22]/90 backdrop-blur-xs text-white text-[11px] font-medium rounded opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 shadow-sm"
            title="Launch Preorder Countdown"
          >
            <Hourglass className="w-3 h-3 text-[#e2a87c]" />
            <span>Countdown</span>
          </button>
        </div>

        {/* Publisher info under cover on desktop */}
        <div className="mt-3 text-center md:text-left w-full hidden md:block">
          <div className="text-[11px] font-mono tracking-tight text-neutral-500 uppercase">Publisher</div>
          <div className="text-xs font-medium text-neutral-800 truncate" title={`${book.publisher} ${book.imprint ? `(${book.imprint})` : ''}`}>
            {book.publisher}
            {book.imprint && book.imprint !== book.publisher && (
              <span className="text-neutral-500 font-normal"> · {book.imprint}</span>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Book Metadata, Formats & Synopsis */}
      <div className="flex-1 p-4 md:pl-2 flex flex-col justify-between">
        <div>
          {/* Header Row: Series & Genre Tags */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              {book.series && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#f0ebe1] text-[#6b5840] border border-[#e4dbce]">
                  <span className="font-serif italic">{book.series.name}</span>
                  <span className="font-mono font-semibold">#{book.series.number}</span>
                </span>
              )}
              {book.genreTags.map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#f5f4f0] text-neutral-600 border border-neutral-200/80"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Mobile Publisher Badge */}
            <span className="text-[11px] text-neutral-500 md:hidden">
              {book.publisher}
            </span>
          </div>

          {/* Title & Author */}
          <div className="mb-2.5">
            <h3
              onClick={() => onOpenDetails(book)}
              className="font-serif text-xl md:text-2xl font-bold text-[#1a1c20] leading-tight hover:text-[#b85d38] transition-colors cursor-pointer"
            >
              {book.title}
            </h3>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm md:text-base font-medium text-neutral-700">by {book.author}</span>
              
              {/* Follow Author Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFollowAuthor(book.author);
                }}
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full transition-colors ${
                  isAuthorFollowed
                    ? 'bg-[#eef5ee] text-[#2d6a4f] border border-[#c3dfc9]'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border border-transparent'
                }`}
                title={isAuthorFollowed ? 'Following author (click to unfollow)' : `Follow ${book.author} for release alerts`}
              >
                {isAuthorFollowed ? (
                  <>
                    <UserCheck className="w-3 h-3" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3 h-3" />
                    <span>Follow Author</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Format Release Timeline Pills */}
          <div className="my-3 p-2.5 bg-[#faf9f6] rounded-lg border border-[#ede9e1]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1.5 flex items-center justify-between">
              <span>Formats & Release Dates</span>
              <span className="text-[10px] text-neutral-400 font-sans normal-case">Dates vary by edition</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {book.formats.map((fmt) => {
                const isHighlight = highlightDate && fmt.releaseDate === highlightDate;
                const isSelectedFormat = selectedFormat === fmt.type;

                return (
                  <div
                    key={fmt.type}
                    className={`px-2 py-1.5 rounded-md text-xs flex flex-col justify-between border transition-all ${
                      isHighlight
                        ? 'bg-[#c25e36]/10 border-[#c25e36] text-[#b85d38] font-semibold ring-1 ring-[#c25e36]/30'
                        : isSelectedFormat
                        ? 'bg-[#1c1d22] text-white border-[#1c1d22]'
                        : 'bg-white border-[#e6e2da] text-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="flex items-center gap-1 font-medium capitalize">
                        {getFormatIcon(fmt.type)}
                        {formatLabels[fmt.type]}
                      </span>
                      {fmt.price && (
                        <span className={`text-[10px] ${isHighlight ? 'text-[#b85d38]' : isSelectedFormat ? 'text-white/80' : 'text-neutral-400'}`}>
                          {fmt.price}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-[11px] font-mono flex items-center justify-between">
                      <span className={isHighlight ? 'text-[#b85d38]' : isSelectedFormat ? 'text-white' : 'text-neutral-900 font-medium'}>
                        {formatShortDate(fmt.releaseDate)}
                      </span>
                      {isHighlight && (
                        <span className="text-[9px] uppercase tracking-wide bg-[#c25e36] text-white px-1 rounded-xs">
                          Today
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Short Synopsis / Blurb */}
          <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2 md:line-clamp-3 mb-2">
            {book.description}
          </p>

          {/* Pull quote if present */}
          {book.featuredQuote && (
            <blockquote className="hidden lg:block text-xs font-serif italic text-neutral-500 border-l-2 border-[#b85d38]/50 pl-2.5 my-2">
              {book.featuredQuote}
            </blockquote>
          )}
        </div>

        {/* Footer Actions & External Links */}
        <div className="pt-3 border-t border-[#f0ede6] flex flex-wrap items-center justify-between gap-2 mt-2">
          {/* Left Action Group: Star / Remind Me, Anticipate Counter, and Notify Me */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              id={`star-btn-${book.id}`}
              type="button"
              onClick={() => onToggleStar(book.id)}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isStarred
                  ? 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200/80'
              }`}
              title={isStarred ? 'Remove from My Watchlist' : 'Add to My Watchlist (Remind Me)'}
            >
              <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-[#d97706] text-[#d97706]' : 'text-neutral-500'}`} />
              <span>{isStarred ? 'Starred' : 'Remind Me'}</span>
            </button>

            {/* Notify Me Toggle Button */}
            <button
              id={`notify-btn-${book.id}`}
              type="button"
              onClick={handleToggleNotify}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isNotified
                  ? 'bg-[#ffe4ee] text-[#d63384] border border-[#ff85a2] shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-pink-50 hover:text-pink-600 border border-neutral-200/80'
              }`}
              title={isNotified ? 'Release day notification active! Click to disable' : 'Get notified on release day!'}
            >
              {isNotified ? (
                <>
                  <BellRing className="w-3.5 h-3.5 text-[#d63384] animate-pulse" />
                  <span className="font-semibold">Notified 🔔</span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Notify Me</span>
                </>
              )}
            </button>

            {/* If notified, show subtle quick test simulate alert button */}
            {isNotified && (
              <button
                type="button"
                onClick={handleSimulateAlert}
                className="text-[10px] font-mono text-[#d63384] hover:underline bg-[#fff0f5] px-1.5 py-1 rounded border border-[#ffd6e6] transition-colors"
                title="Test simulated release notification right now"
              >
                Test Alert ⚡
              </button>
            )}

            <button
              id={`anticipate-btn-${book.id}`}
              type="button"
              onClick={() => onToggleAnticipate(book.id)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isAnticipated
                  ? 'bg-[#ffedd5] text-[#c2410c] border border-[#fed7aa]'
                  : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border border-neutral-200/60'
              }`}
              title="Mark your anticipation for this title"
            >
              <Flame className={`w-3.5 h-3.5 ${isAnticipated ? 'fill-[#ea580c] text-[#ea580c]' : 'text-neutral-400'}`} />
              <span className="font-mono text-[11px]">{totalAnticipation.toLocaleString()}</span>
            </button>
          </div>

          {/* Right Action Group: ISBN, Goodreads/StoryGraph, and Countdown Button */}
          <div className="flex items-center gap-1.5">
            {/* ISBN Copy Button */}
            <button
              type="button"
              onClick={handleCopyIsbn}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-mono text-neutral-500 hover:text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors"
              title="Copy ISBN-13 to clipboard"
            >
              {copiedIsbn ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>ISBN</span>
                </>
              )}
            </button>

            {/* Goodreads Link */}
            <a
              href={`https://www.goodreads.com/search?q=${encodeURIComponent(book.isbn || book.title)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-[#593d18] bg-[#f8f5ee] hover:bg-[#ede5d5] border border-[#e4dcce] rounded transition-colors"
              title="Lookup on Goodreads"
            >
              <span>Goodreads</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>

            {/* StoryGraph Link */}
            <a
              href={`https://app.thestorygraph.com/browse?search_term=${encodeURIComponent(book.isbn || book.title)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-[#1e3a5f] bg-[#eef4f9] hover:bg-[#dbe7f2] border border-[#d0e0ed] rounded transition-colors"
              title="Lookup on StoryGraph"
            >
              <span>StoryGraph</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>

            {/* Details CTA */}
            <button
              type="button"
              onClick={() => onOpenDetails(book)}
              className="px-2.5 py-1 text-xs font-medium text-[#1c1d22] hover:bg-neutral-100 rounded transition-colors"
            >
              Details →
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
