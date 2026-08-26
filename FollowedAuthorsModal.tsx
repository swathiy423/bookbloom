import React, { useState } from 'react';
import { Book } from '../types';
import { getBooksByAuthors } from '../services/bookService';
import { X, Users, UserCheck, Trash2, BookOpen, Plus, ExternalLink, Calendar } from 'lucide-react';
import { BookCoverImage } from './BookCoverImage';

interface FollowedAuthorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  followedAuthors: string[];
  onToggleFollowAuthor: (author: string) => void;
  onOpenBookDetails: (book: Book) => void;
}

export const FollowedAuthorsModal: React.FC<FollowedAuthorsModalProps> = ({
  isOpen,
  onClose,
  followedAuthors,
  onToggleFollowAuthor,
  onOpenBookDetails,
}) => {
  const [newAuthorInput, setNewAuthorInput] = useState('');

  if (!isOpen) return null;

  const authorBooks = getBooksByAuthors(followedAuthors);

  const handleAddAuthor = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAuthorInput.trim()) {
      onToggleFollowAuthor(newAuthorInput.trim());
      setNewAuthorInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#e8e4dc] overflow-hidden z-10 my-8 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#f0ede6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eef5ee] text-[#2d6a4f] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1a1c20]">
                Followed Authors ({followedAuthors.length})
              </h2>
              <p className="text-xs text-neutral-500">
                You will receive alerts on the Today feed whenever these authors release new books.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Author Input Form */}
        <div className="p-6 pb-4 bg-[#faf8f5] border-b border-[#f0ede6]">
          <form onSubmit={handleAddAuthor} className="flex gap-2">
            <input
              type="text"
              placeholder="Add author name (e.g. Rebecca Yarros, Stephen King)..."
              value={newAuthorInput}
              onChange={(e) => setNewAuthorInput(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs bg-white text-neutral-800 rounded-xl border border-[#e8e4dc] focus:outline-hidden focus:ring-1 focus:ring-[#2d6a4f]"
            />
            <button
              type="submit"
              disabled={!newAuthorInput.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#2d6a4f] text-white rounded-xl hover:bg-[#1b4332] transition-colors disabled:opacity-40"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Follow</span>
            </button>
          </form>

          {/* Followed Authors Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {followedAuthors.map((author) => (
              <span
                key={author}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white text-neutral-800 border border-[#e8e4dc] shadow-xs"
              >
                <span>{author}</span>
                <button
                  onClick={() => onToggleFollowAuthor(author)}
                  className="text-neutral-400 hover:text-rose-600 transition-colors"
                  title={`Unfollow ${author}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {followedAuthors.length === 0 && (
              <p className="text-xs text-neutral-400 italic">No authors followed yet.</p>
            )}
          </div>
        </div>

        {/* Scheduled Titles by Followed Authors */}
        <div className="p-6 overflow-y-auto flex-1">
          <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3">
            Upcoming & Catalog Titles by Followed Authors ({authorBooks.length})
          </h3>

          {authorBooks.length > 0 ? (
            <div className="space-y-3">
              {authorBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => {
                    onClose();
                    onOpenBookDetails(book);
                  }}
                  className="flex items-center gap-3 p-3 bg-[#faf9f6] hover:bg-[#f2efe9] rounded-xl border border-[#ede9e1] transition-colors cursor-pointer"
                >
                  <div className="w-12 shrink-0">
                    <BookCoverImage src={book.coverImage} title={book.title} author={book.author} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm font-bold text-neutral-900 truncate">
                      {book.title}
                    </h4>
                    <p className="text-xs text-neutral-600">by {book.author}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-[#b85d38]">
                      <Calendar className="w-3 h-3" />
                      <span>{book.primaryReleaseDate}</span>
                      <span className="text-neutral-400 font-sans">· {book.publisher}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#b85d38] shrink-0">
                    View →
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-400">
              <p className="text-xs">No upcoming books found in the current dataset for followed authors.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
