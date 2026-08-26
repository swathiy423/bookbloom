export type BookFormatType = 'hardcover' | 'paperback' | 'ebook' | 'audiobook';

export interface BookFormat {
  type: BookFormatType;
  releaseDate: string; // ISO format: YYYY-MM-DD
  price?: string;
  pageCount?: number;
  narrator?: string;
  duration?: string;
  isbnOrAsin?: string;
}

export interface SeriesInfo {
  name: string;
  number: number;
  totalInSeries?: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  authorBio?: string;
  publisher: string;
  imprint?: string;
  coverImage: string;
  genreTags: string[];
  series?: SeriesInfo | null;
  description: string;
  isbn: string; // ISBN-13 format
  formats: BookFormat[];
  anticipatedCount: number; // Base initial reader excitement count
  featuredQuote?: string;
  pageCount?: number;
  goodreadsId?: string;
  storyGraphId?: string;
  tags?: string[];
  primaryReleaseDate: string; // Earliest format release date YYYY-MM-DD
}

export interface PublishingHistoryEntry {
  id: string;
  title: string;
  author: string;
  originalReleaseDate: string; // e.g. "1958-08-26"
  originalYear: number;
  publisher: string;
  coverImage: string;
  genre: string;
  historicalFact: string;
  legacyImpact: string;
  isbn?: string;
}

export interface FilterState {
  genre: string | null;
  publisher: string | null;
  format: BookFormatType | 'all';
  searchQuery: string;
  onlyFollowedAuthors: boolean;
  sortBy: 'date-asc' | 'date-desc' | 'anticipated' | 'title' | 'author';
}

export type ActiveView =
  | 'today'
  | 'calendar'
  | 'digest'
  | 'watchlist'
  | 'countdown';

export interface WeeklyDigestGroup {
  weekNumber: number;
  weekLabel: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  books: Book[];
}

export interface DateReleaseGroup {
  date: string; // YYYY-MM-DD
  displayDate: string; // "Wednesday, August 26"
  booksWithFormats: {
    book: Book;
    releasingFormats: BookFormat[];
  }[];
}
