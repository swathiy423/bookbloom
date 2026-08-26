import React, { useState, useEffect } from 'react';
import { Book, BookFormatType } from '../types';
import { getBookByIsbn, calculateDaysUntil } from '../services/bookService';
import { BookCoverImage } from './BookCoverImage';
import {
  Hourglass,
  Calendar,
  Share2,
  Code,
  Copy,
  Check,
  Star,
  Flame,
  ExternalLink,
  BookOpen,
  ArrowLeft,
  Sparkles,
  Bookmark,
  BookMarked,
  FileText,
  Headphones,
  Bell,
  BellRing,
} from 'lucide-react';

interface CountdownViewProps {
  isbn: string;
  onBack: () => void;
  isStarred: boolean;
  onToggleStar: (bookId: string) => void;
  isAnticipated: boolean;
  onToggleAnticipate: (bookId: string) => void;
  onToggleFollowAuthor: (author: string) => void;
  isAuthorFollowed: boolean;
  isNotified?: boolean;
  onToggleNotify?: (bookId: string) => void;
}

export const CountdownView: React.FC<CountdownViewProps> = ({
  isbn,
  onBack,
  isStarred,
  onToggleStar,
  isAnticipated,
  onToggleAnticipate,
  onToggleFollowAuthor,
  isAuthorFollowed,
  isNotified = false,
  onToggleNotify,
}) => {
  const book = getBookByIsbn(isbn);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // Time remaining state
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isReleased: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isReleased: false });

  const targetDateStr = book?.primaryReleaseDate || '2026-08-26';

  useEffect(() => {
    const updateCountdown = () => {
      const targetTime = new Date(`${targetDateStr}T00:00:00`).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isReleased: true });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isReleased: false });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  if (!book) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
        <h2 className="font-serif text-2xl font-bold text-neutral-800">Title Not Found</h2>
        <p className="text-sm text-neutral-500 mt-2 mb-6">
          Could not locate a title matching ISBN: <code className="font-mono text-neutral-700">{isbn}</code>
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold bg-[#1c1d22] text-white rounded-lg hover:bg-neutral-800"
        >
          ← Return to Feed
        </button>
      </div>
    );
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#/countdown/${book.isbn}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbedCode = () => {
    const embedSnippet = `<iframe src="${window.location.origin}${window.location.pathname}#/countdown/${book.isbn}?embed=true" width="100%" height="450" frameborder="0" style="border-radius: 12px; overflow: hidden;" title="BookBloom Countdown for ${book.title}"></iframe>`;
    navigator.clipboard.writeText(embedSnippet);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const totalAnticipation = book.anticipatedCount + (isAnticipated ? 1 : 0);

  const formatReleaseHeading = (isoDate: string) => {
    try {
      const [y, m, d] = isoDate.split('-').map(Number);
      return new Date(y, m - 1, d).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoDate;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 rounded-lg border border-[#e8e4dc] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Feed</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white hover:bg-neutral-100 text-neutral-800 rounded-lg border border-[#e8e4dc] transition-colors"
            title="Copy shareable countdown link"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-medium">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-neutral-500" />
                <span>Share Countdown</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyEmbedCode}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#1c1d22] hover:bg-neutral-800 text-white rounded-lg transition-colors"
            title="Copy HTML embed snippet for author sites or blogs"
          >
            {copiedEmbed ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Embed Code Copied!</span>
              </>
            ) : (
              <>
                <Code className="w-3.5 h-3.5" />
                <span>Copy Embed Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Countdown Showcase Card */}
      <div className="bg-[#1c232d] text-[#f7f5f0] rounded-3xl p-6 sm:p-10 border border-[#303c4c] shadow-[0_12px_40px_rgba(0,0,0,0.18)] relative overflow-hidden">
        {/* Background decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#b85d38]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: Big Cover Artwork */}
          <div className="md:col-span-4 flex justify-center">
            <div className="w-48 sm:w-56 lg:w-64 shadow-2xl rounded-lg overflow-hidden border border-white/10">
              <BookCoverImage
                src={book.coverImage}
                title={book.title}
                author={book.author}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column: Countdown Clock & Book Metadata */}
          <div className="md:col-span-8 flex flex-col justify-between">
            <div>
              {/* Eyebrow badge */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-[#b85d38] text-white">
                  PREORDER COUNTDOWN
                </span>
                {book.series && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-serif italic bg-white/10 text-neutral-200 border border-white/15">
                    {book.series.name} #{book.series.number}
                  </span>
                )}
                <span className="text-xs font-mono text-neutral-400">
                  Target: {formatReleaseHeading(book.primaryReleaseDate)}
                </span>
              </div>

              {/* Title & Author */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight mb-2">
                {book.title}
              </h1>
              <p className="text-lg sm:text-xl text-neutral-300 font-medium mb-6">
                by <strong className="text-white font-serif">{book.author}</strong>
              </p>

              {/* Ticking Countdown Grid */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 my-6 bg-black/30 p-4 sm:p-6 rounded-2xl border border-white/10 text-center">
                <div className="flex flex-col items-center">
                  <span className="font-mono text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-neutral-400 mt-1">
                    Days
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-mono text-3xl sm:text-5xl lg:text-6xl font-bold text-[#e2a87c] tracking-tight">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-neutral-400 mt-1">
                    Hours
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-mono text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-neutral-400 mt-1">
                    Mins
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-mono text-3xl sm:text-5xl lg:text-6xl font-bold text-[#e2a87c] tracking-tight">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-neutral-400 mt-1">
                    Secs
                  </span>
                </div>
              </div>

              {/* Quote if present */}
              {book.featuredQuote && (
                <blockquote className="font-serif italic text-sm text-neutral-300 border-l-2 border-[#b85d38] pl-3 my-4">
                  {book.featuredQuote}
                </blockquote>
              )}
            </div>

            {/* Actions Bar */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onToggleStar(book.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    isStarred
                      ? 'bg-[#fef3c7] text-[#92400e] font-semibold'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Star className={`w-4 h-4 ${isStarred ? 'fill-[#d97706] text-[#d97706]' : ''}`} />
                  <span>{isStarred ? 'Saved to Watchlist' : 'Remind Me'}</span>
                </button>

                <button
                  onClick={() => onToggleAnticipate(book.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    isAnticipated
                      ? 'bg-[#ffedd5] text-[#c2410c] font-semibold'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Flame className={`w-4 h-4 ${isAnticipated ? 'fill-[#ea580c] text-[#ea580c]' : 'text-[#ea580c]'}`} />
                  <span>{totalAnticipation.toLocaleString()} Anticipating</span>
                </button>

                <button
                  onClick={() => onToggleNotify && onToggleNotify(book.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    isNotified
                      ? 'bg-[#ff6b8b] text-white font-semibold shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-pink-200'
                  }`}
                  title="Notify me on browser when this book releases"
                >
                  {isNotified ? <BellRing className="w-4 h-4 animate-bounce" /> : <Bell className="w-4 h-4" />}
                  <span>{isNotified ? '🔔 Release Alert Active' : '🔔 Notify on Release Day'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.goodreads.com/search?q=${encodeURIComponent(book.isbn)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium bg-white/10 hover:bg-white/20 text-neutral-200 rounded-xl transition-colors"
                >
                  <span>Goodreads</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={`https://app.thestorygraph.com/browse?search_term=${encodeURIComponent(book.isbn)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium bg-white/10 hover:bg-white/20 text-neutral-200 rounded-xl transition-colors"
                >
                  <span>StoryGraph</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Formats Schedule Section */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3">
            Format Release Roadmap
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {book.formats.map((fmt) => (
              <div
                key={fmt.type}
                className="bg-white/5 rounded-xl p-3 border border-white/10 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs capitalize text-neutral-200">
                  <span className="font-semibold">{fmt.type}</span>
                  {fmt.price && <span className="font-mono text-neutral-400">{fmt.price}</span>}
                </div>
                <div className="mt-2 text-sm font-mono font-bold text-white">
                  {fmt.releaseDate}
                </div>
                {fmt.narrator && (
                  <div className="text-[11px] text-neutral-400 mt-1 truncate">
                    Narrated by {fmt.narrator}
                  </div>
                )}
                {fmt.pageCount && (
                  <div className="text-[11px] text-neutral-400 mt-1 font-mono">
                    {fmt.pageCount} pages
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
