import React, { useState } from 'react';
import { Book, BookFormatType } from '../types';
import { BookCoverImage } from './BookCoverImage';
import { notificationService } from '../services/notificationService';
import { sound } from '../utils/soundEffects';
import {
  X,
  Star,
  Flame,
  Hourglass,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  UserPlus,
  UserCheck,
  Building2,
  Bookmark,
  BookMarked,
  FileText,
  Headphones,
  Calendar,
  Bell,
  BellRing,
  Sparkles,
} from 'lucide-react';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
  isStarred: boolean;
  onToggleStar: (id: string) => void;
  isAnticipated: boolean;
  onToggleAnticipate: (id: string) => void;
  isAuthorFollowed: boolean;
  onToggleFollowAuthor: (author: string) => void;
  onOpenCountdown: (isbn: string) => void;
  isNotified?: boolean;
  onToggleNotify?: (id: string) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  onClose,
  isStarred,
  onToggleStar,
  isAnticipated,
  onToggleAnticipate,
  isAuthorFollowed,
  onToggleFollowAuthor,
  onOpenCountdown,
  isNotified = false,
  onToggleNotify,
}) => {
  const [copiedIsbn, setCopiedIsbn] = useState(false);

  if (!book) return null;

  const handleCopyIsbn = () => {
    navigator.clipboard.writeText(book.isbn);
    setCopiedIsbn(true);
    setTimeout(() => setCopiedIsbn(false), 2000);
  };

  const handleToggleNotify = () => {
    sound.playSparkle();
    if (onToggleNotify) {
      onToggleNotify(book.id);
    }
  };

  const handleSimulateAlert = () => {
    notificationService.triggerReleaseDayNotification(book, book.primaryReleaseDate, true);
  };

  const totalAnticipation = book.anticipatedCount + (isAnticipated ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-[#e8e4dc] overflow-hidden z-10 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Left: Book Cover Artwork */}
            <div className="w-40 sm:w-48 shrink-0 mx-auto md:mx-0">
              <BookCoverImage src={book.coverImage} title={book.title} author={book.author} />
              
              <button
                onClick={() => {
                  onClose();
                  onOpenCountdown(book.isbn);
                }}
                className="w-full mt-3 py-2 px-3 bg-[#1c1d22] hover:bg-neutral-800 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Hourglass className="w-3.5 h-3.5 text-[#e2a87c]" />
                <span>Preorder Countdown</span>
              </button>
            </div>

            {/* Right: Metadata, Blurb & Formats */}
            <div className="flex-1">
              {/* Tags & Series */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {book.series && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f0ebe1] text-[#6b5840] border border-[#e4dbce]">
                    <span className="font-serif italic">{book.series.name}</span> #{book.series.number}
                  </span>
                )}
                {book.genreTags.map((g) => (
                  <span
                    key={g}
                    className="px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Title & Author */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1c20] leading-tight">
                {book.title}
              </h2>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-base font-medium text-neutral-800">by {book.author}</span>
                <button
                  type="button"
                  onClick={() => onToggleFollowAuthor(book.author)}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full transition-colors ${
                    isAuthorFollowed
                      ? 'bg-[#eef5ee] text-[#2d6a4f] border border-[#c3dfc9]'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {isAuthorFollowed ? (
                    <>
                      <UserCheck className="w-3 h-3" />
                      <span>Following Author</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3" />
                      <span>Follow Author</span>
                    </>
                  )}
                </button>
              </div>

              {book.authorBio && (
                <p className="text-xs text-neutral-500 mt-1 italic">{book.authorBio}</p>
              )}

              {/* Publisher & ISBN Row */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 font-mono mt-3 py-2 border-y border-[#f0ede6]">
                <div>
                  Publisher:{' '}
                  <strong className="text-neutral-800">
                    {book.publisher} {book.imprint && `(${book.imprint})`}
                  </strong>
                </div>
                <div className="flex items-center gap-1">
                  <span>ISBN:</span>
                  <button
                    onClick={handleCopyIsbn}
                    className="inline-flex items-center gap-1 font-mono text-neutral-700 hover:text-neutral-900 bg-neutral-100 px-1.5 py-0.5 rounded"
                  >
                    {copiedIsbn ? (
                      <span className="text-emerald-700">Copied!</span>
                    ) : (
                      <>
                        <span>{book.isbn}</span>
                        <Copy className="w-2.5 h-2.5 text-neutral-400" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Full Description */}
              <div className="mt-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Synopsis
                </h3>
                <p className="text-sm text-neutral-700 leading-relaxed">{book.description}</p>
              </div>

              {/* Formats Grid */}
              <div className="mt-5 p-3.5 bg-[#faf9f6] rounded-xl border border-[#ede9e1]">
                <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                  Format Editions & Releases
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                  {book.formats.map((f) => (
                    <div
                      key={f.type}
                      className="p-2 bg-white rounded-lg border border-[#e4dfd5] text-xs flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between capitalize font-semibold text-neutral-800">
                        <span>{f.type}</span>
                        {f.price && <span className="font-mono text-neutral-500 font-normal">{f.price}</span>}
                      </div>
                      <div className="text-[11px] font-mono text-[#b85d38] font-medium mt-1">
                        🗓️ {f.releaseDate}
                      </div>
                      {f.narrator && (
                        <div className="text-[10px] text-neutral-500 truncate mt-0.5">
                          Narrated by {f.narrator}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Release Day Notification Companion Card */}
              <div className="mt-5 p-3.5 bg-gradient-to-r from-[#fff0f5] via-[#ffeef4] to-[#fcf0f8] rounded-xl border border-[#ffccd9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white text-[#d63384] border border-[#ffb6ce] flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
                    <BellRing className={`w-4 h-4 ${isNotified ? 'text-[#d63384] animate-bounce' : 'text-neutral-400'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-kawaii text-xs sm:text-sm font-bold text-[#4a3832]">
                        {isNotified ? '🌸 Release Day Alert Active!' : '🔔 Get Notified on Release Day'}
                      </h4>
                      {isNotified && (
                        <span className="text-[10px] font-cute bg-[#ff85a2] text-white px-2 py-0.2 rounded-full font-bold">
                          Enabled ✨
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 font-cute mt-0.5">
                      {isNotified
                        ? `We will send a browser notification & cozy chime on ${book.primaryReleaseDate}!`
                        : `Never miss ${book.title}. Toggle on to trigger a browser notification on ${book.primaryReleaseDate}.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {isNotified && (
                    <button
                      onClick={handleSimulateAlert}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-[#ffb6ce] text-[#d63384] hover:bg-[#fff5f8] text-xs font-cute font-semibold shadow-xs transition-transform active:scale-95 cursor-pointer"
                      title="Test simulated notification now"
                    >
                      ⚡ Test Alert
                    </button>
                  )}
                  <button
                    onClick={handleToggleNotify}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-kawaii font-bold transition-all shadow-xs cursor-pointer ${
                      isNotified
                        ? 'bg-[#d63384] text-white hover:bg-[#b02268]'
                        : 'bg-white text-[#d63384] border border-[#ff85a2] hover:bg-[#ffeef4]'
                    }`}
                  >
                    {isNotified ? '🔔 Notified' : 'Notify Me'}
                  </button>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="mt-6 pt-4 border-t border-[#f0ede6] flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onToggleStar(book.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isStarred
                        ? 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-[#d97706] text-[#d97706]' : ''}`} />
                    <span>{isStarred ? 'Saved in Watchlist' : 'Add to Watchlist'}</span>
                  </button>

                  <button
                    onClick={handleToggleNotify}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isNotified
                        ? 'bg-[#ffe4ee] text-[#d63384] border border-[#ff85a2]'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-pink-50 hover:text-pink-600'
                    }`}
                  >
                    <Bell className={`w-3.5 h-3.5 ${isNotified ? 'fill-[#d63384] text-[#d63384]' : ''}`} />
                    <span>{isNotified ? 'Alerts On 🔔' : 'Notify Me'}</span>
                  </button>

                  <button
                    onClick={() => onToggleAnticipate(book.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isAnticipated
                        ? 'bg-[#ffedd5] text-[#c2410c] border border-[#fed7aa]'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    <Flame className={`w-3.5 h-3.5 ${isAnticipated ? 'fill-[#ea580c] text-[#ea580c]' : 'text-[#ea580c]'}`} />
                    <span>{totalAnticipation.toLocaleString()} Anticipating</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.goodreads.com/search?q=${encodeURIComponent(book.isbn)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium bg-[#f8f5ee] hover:bg-[#ede5d5] text-[#593d18] rounded-lg border border-[#e4dcce]"
                  >
                    <span>Goodreads</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <a
                    href={`https://app.thestorygraph.com/browse?search_term=${encodeURIComponent(book.isbn)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium bg-[#eef4f9] hover:bg-[#dbe7f2] text-[#1e3a5f] rounded-lg border border-[#d0e0ed]"
                  >
                    <span>StoryGraph</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
