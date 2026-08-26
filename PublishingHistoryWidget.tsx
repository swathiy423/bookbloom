import React, { useState } from 'react';
import { PublishingHistoryEntry } from '../types';
import { BookOpen, Calendar, History, Bookmark, Sparkles, ExternalLink, ChevronRight } from 'lucide-react';
import { BookCoverImage } from './BookCoverImage';

interface PublishingHistoryWidgetProps {
  entry: PublishingHistoryEntry;
  currentDateDisplay: string;
}

export const PublishingHistoryWidget: React.FC<PublishingHistoryWidgetProps> = ({
  entry,
  currentDateDisplay,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      aria-labelledby="history-widget-heading"
      className="relative overflow-hidden bg-gradient-to-r from-[#212730] via-[#29323f] to-[#1c232d] text-[#f7f5f0] rounded-2xl p-5 md:p-6 mb-8 border border-[#3b4759] shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
    >
      {/* Background Archival Seal Watermark */}
      <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none select-none">
        <BookOpen className="w-64 h-64 text-white" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Section: Header & Book Metadata */}
        <div className="flex-1">
          {/* Eyebrow badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[#e2a87c]/20 text-[#f5c7a3] border border-[#e2a87c]/40">
              <History className="w-3 h-3" />
              <span>This Day in Publishing History</span>
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              {entry.originalYear} ({new Date().getFullYear() - entry.originalYear} Years Ago)
            </span>
          </div>

          {/* Title & Author */}
          <h3 id="history-widget-heading" className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
            {entry.title}
          </h3>
          <p className="text-sm md:text-base text-neutral-300 font-medium mt-1">
            by {entry.author} <span className="text-neutral-400">· Published by {entry.publisher}</span>
          </p>

          {/* Historical Fact */}
          <p className="text-sm text-neutral-200 mt-3 leading-relaxed max-w-3xl">
            {entry.historicalFact}
          </p>

          {/* Legacy Impact note */}
          <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-neutral-300">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#e2a87c]" />
              <span>
                <strong>Literary Impact:</strong> {entry.legacyImpact}
              </span>
            </div>

            {entry.isbn && (
              <a
                href={`https://www.goodreads.com/search?q=${encodeURIComponent(entry.isbn)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[#e2a87c] hover:underline"
              >
                <span>Read Classic on Goodreads</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Right Section: Visual Book Representation */}
        <div className="w-24 md:w-28 shrink-0 hidden sm:block">
          <BookCoverImage
            src={entry.coverImage}
            title={entry.title}
            author={entry.author}
            className="w-full h-full object-cover shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};
