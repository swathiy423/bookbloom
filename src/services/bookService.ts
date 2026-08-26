import { BOOKS_DATASET, PUBLISHING_HISTORY_ENTRIES } from '../data/booksData';
import { Book, BookFormat, FilterState, PublishingHistoryEntry, WeeklyDigestGroup } from '../types';

/**
 * BookBloom Thin Data-Access Layer
 *
 * All UI components interact exclusively through this service module.
 * In a future migration, these methods can be converted to async API fetchers
 * or GraphQL queries without altering any consumer view components.
 */

// Helper to format ISO date string YYYY-MM-DD
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Calculate days between two dates
export function calculateDaysUntil(targetDateStr: string, fromDateStr?: string): number {
  const fromDate = fromDateStr ? new Date(`${fromDateStr}T00:00:00`) : new Date();
  fromDate.setHours(0, 0, 0, 0);

  const targetDate = new Date(`${targetDateStr}T00:00:00`);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - fromDate.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

// Get all books with optional filters
export function getBooks(filters?: Partial<FilterState>): Book[] {
  let result = [...BOOKS_DATASET];

  if (!filters) return result;

  if (filters.searchQuery && filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.includes(q) ||
        (b.series && b.series.name.toLowerCase().includes(q)) ||
        b.publisher.toLowerCase().includes(q) ||
        (b.imprint && b.imprint.toLowerCase().includes(q)) ||
        b.genreTags.some((g) => g.toLowerCase().includes(q))
    );
  }

  if (filters.genre) {
    const targetGenre = filters.genre.toLowerCase();
    result = result.filter((b) =>
      b.genreTags.some((g) => g.toLowerCase() === targetGenre)
    );
  }

  if (filters.publisher) {
    const targetPub = filters.publisher.toLowerCase();
    result = result.filter(
      (b) =>
        b.publisher.toLowerCase() === targetPub ||
        (b.imprint && b.imprint.toLowerCase() === targetPub)
    );
  }

  if (filters.format && filters.format !== 'all') {
    const targetFormat = filters.format;
    result = result.filter((b) => b.formats.some((f) => f.type === targetFormat));
  }

  return result;
}

// Get a single book by ISBN
export function getBookByIsbn(isbn: string): Book | undefined {
  const clean = isbn.replace(/[-\s]/g, '');
  return BOOKS_DATASET.find((b) => b.isbn.replace(/[-\s]/g, '') === clean);
}

// Get a single book by ID
export function getBookById(id: string): Book | undefined {
  return BOOKS_DATASET.find((b) => b.id === id);
}

// Get books with active format releases on a specific calendar date (YYYY-MM-DD)
export function getBooksReleasingOnDate(
  dateStr: string,
  genre?: string | null,
  publisher?: string | null
): { book: Book; releasingFormats: BookFormat[] }[] {
  const books = getBooks({ genre: genre || null, publisher: publisher || null });
  const matched: { book: Book; releasingFormats: BookFormat[] }[] = [];

  for (const book of books) {
    const releasingFormats = book.formats.filter((f) => f.releaseDate === dateStr);
    if (releasingFormats.length > 0) {
      matched.push({ book, releasingFormats });
    }
  }

  // Sort by anticipated count descending
  return matched.sort((a, b) => b.book.anticipatedCount - a.book.anticipatedCount);
}

// Get map of dates in a given month that have releases
export function getBooksForMonth(
  year: number,
  monthIndex: number, // 0-11
  genre?: string | null,
  publisher?: string | null
): { [dateStr: string]: { book: Book; formats: BookFormat[] }[] } {
  const prefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
  const books = getBooks({ genre: genre || null, publisher: publisher || null });
  const map: { [dateStr: string]: { book: Book; formats: BookFormat[] }[] } = {};

  for (const book of books) {
    for (const fmt of book.formats) {
      if (fmt.releaseDate.startsWith(prefix)) {
        if (!map[fmt.releaseDate]) {
          map[fmt.releaseDate] = [];
        }
        // Avoid duplicate book in same date entry
        const existing = map[fmt.releaseDate].find((item) => item.book.id === book.id);
        if (existing) {
          if (!existing.formats.some((f) => f.type === fmt.type)) {
            existing.formats.push(fmt);
          }
        } else {
          map[fmt.releaseDate].push({ book, formats: [fmt] });
        }
      }
    }
  }

  return map;
}

// Get weekly grouped releases for a specific month (1st week, 2nd week, etc.)
export function getWeeklyDigests(
  year: number,
  monthIndex: number, // 0-11
  genre?: string | null,
  publisher?: string | null
): WeeklyDigestGroup[] {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const monthStr = String(monthIndex + 1).padStart(2, '0');
  const monthName = new Date(year, monthIndex, 1).toLocaleString('default', { month: 'long' });

  const weekIntervals = [
    { start: 1, end: 7, label: `Week 1 (${monthName} 1–7)` },
    { start: 8, end: 14, label: `Week 2 (${monthName} 8–14)` },
    { start: 15, end: 21, label: `Week 3 (${monthName} 15–21)` },
    { start: 22, end: 28, label: `Week 4 (${monthName} 22–28)` },
    { start: 29, end: daysInMonth, label: `Week 5 (${monthName} 29–${daysInMonth})` },
  ].filter((w) => w.start <= daysInMonth);

  const groups: WeeklyDigestGroup[] = [];

  for (let i = 0; i < weekIntervals.length; i++) {
    const interval = weekIntervals[i];
    const startDate = `${year}-${monthStr}-${String(interval.start).padStart(2, '0')}`;
    const endDate = `${year}-${monthStr}-${String(interval.end).padStart(2, '0')}`;

    // Collect all books with at least one format releasing between start & end
    const books = getBooks({ genre: genre || null, publisher: publisher || null });
    const weekBooksMap = new Map<string, Book>();

    for (const b of books) {
      const hasReleaseInWeek = b.formats.some(
        (f) => f.releaseDate >= startDate && f.releaseDate <= endDate
      );
      if (hasReleaseInWeek) {
        weekBooksMap.set(b.id, b);
      }
    }

    const sortedBooks = Array.from(weekBooksMap.values()).sort((a, b) => {
      // Find earliest release date in this week for each book
      const aMin = Math.min(
        ...a.formats
          .filter((f) => f.releaseDate >= startDate && f.releaseDate <= endDate)
          .map((f) => new Date(f.releaseDate).getTime())
      );
      const bMin = Math.min(
        ...b.formats
          .filter((f) => f.releaseDate >= startDate && f.releaseDate <= endDate)
          .map((f) => new Date(f.releaseDate).getTime())
      );
      return aMin - bMin || b.anticipatedCount - a.anticipatedCount;
    });

    groups.push({
      weekNumber: i + 1,
      weekLabel: interval.label,
      startDate,
      endDate,
      books: sortedBooks,
    });
  }

  return groups;
}

// Get all unique genres with counts
export function getAllGenres(): { name: string; count: number }[] {
  const map: { [genre: string]: number } = {};
  for (const book of BOOKS_DATASET) {
    for (const tag of book.genreTags) {
      map[tag] = (map[tag] || 0) + 1;
    }
  }

  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

// Get all unique publishers with counts
export function getAllPublishers(): { name: string; count: number }[] {
  const map: { [pub: string]: number } = {};
  for (const book of BOOKS_DATASET) {
    map[book.publisher] = (map[book.publisher] || 0) + 1;
    if (book.imprint && book.imprint !== book.publisher) {
      map[book.imprint] = (map[book.imprint] || 0) + 1;
    }
  }

  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

// Get books by specific followed authors
export function getBooksByAuthors(authors: string[]): Book[] {
  if (!authors || authors.length === 0) return [];
  const set = new Set(authors.map((a) => a.toLowerCase().trim()));
  return BOOKS_DATASET.filter((b) => set.has(b.author.toLowerCase().trim()));
}

// Get "This Day in Publishing History" for a given month and day
export function getThisDayInHistory(month: number, day: number): PublishingHistoryEntry | undefined {
  const targetPattern = `-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return PUBLISHING_HISTORY_ENTRIES.find((entry) => entry.originalReleaseDate.endsWith(targetPattern));
}

// Fallback historical release (closest or default)
export function getFeaturedHistoricalEntry(month = 8, day = 26): PublishingHistoryEntry {
  const exact = getThisDayInHistory(month, day);
  if (exact) return exact;
  return PUBLISHING_HISTORY_ENTRIES[0];
}

// Format week releases as clean plain text for newsletter or social sharing
export function formatWeekAsPlainText(weekGroup: WeeklyDigestGroup): string {
  if (!weekGroup.books || weekGroup.books.length === 0) {
    return `🌸 BookBloom Digest — ${weekGroup.weekLabel}\nNo scheduled major releases this week.`;
  }

  const lines = [
    `🌸 BookBloom Literary Digest: ${weekGroup.weekLabel}`,
    `--------------------------------------------------`,
    `Here are this week's new book releases to add to your reading list:\n`,
  ];

  weekGroup.books.forEach((book, idx) => {
    const formatsList = book.formats
      .filter((f) => f.releaseDate >= weekGroup.startDate && f.releaseDate <= weekGroup.endDate)
      .map((f) => `${f.type.toUpperCase()} (${f.releaseDate})`)
      .join(', ');

    const seriesText = book.series ? ` [${book.series.name} #${book.series.number}]` : '';
    lines.push(`${idx + 1}. "${book.title}" by ${book.author}${seriesText}`);
    lines.push(`   • Publisher: ${book.publisher}${book.imprint ? ` (${book.imprint})` : ''}`);
    lines.push(`   • Genre: ${book.genreTags.join(', ')}`);
    lines.push(`   • Formats Releasing: ${formatsList}`);
    lines.push(`   • ISBN: ${book.isbn}`);
    lines.push(`   • Synopsis: ${book.description}`);
    lines.push('');
  });

  lines.push(`Curated via BookBloom 🌸 — The Cozy Literary Release Calendar.`);
  return lines.join('\n');
}
