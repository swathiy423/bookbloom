# Contributing & Adding Titles to BookBloom 🌸

Welcome to the BookBloom dataset! BookBloom maintains a cozy, reader-facing catalog of verified upcoming and newly released titles across formats.

---

## 1. Data Model Schema

Every book entry in `src/data/booksData.ts` complies with the `Book` TypeScript interface:

```typescript
export interface BookFormat {
  type: 'hardcover' | 'paperback' | 'ebook' | 'audiobook';
  releaseDate: string; // ISO 8601: 'YYYY-MM-DD'
  price?: string;      // e.g. '$29.00'
  pageCount?: number;  // e.g. 416
  narrator?: string;   // For audiobooks
  duration?: string;   // e.g. '11 hrs 45 mins'
  isbnOrAsin?: string;
}

export interface SeriesInfo {
  name: string;        // Series title, e.g. 'The Stormlight Archive'
  number: number;      // Book number, e.g. 5
  totalInSeries?: number; // e.g. 10
}

export interface Book {
  id: string;                 // Unique identifier, e.g. 'book-042'
  title: string;              // Full book title
  author: string;             // Primary author / writer
  authorBio?: string;         // 1-2 sentence background
  publisher: string;          // Main publisher, e.g. 'Tor Publishing Group'
  imprint?: string;           // Imprint name, e.g. 'Tor Books', 'Viking'
  coverImage: string;         // Verified cover image URL
  genreTags: string[];        // Array of 2-4 genre tags
  series?: SeriesInfo | null; // Optional series details
  description: string;        // 2-3 sentence engaging synopsis
  isbn: string;               // Valid standard 13-digit ISBN
  formats: BookFormat[];      // Format array with per-format release dates
  anticipatedCount: number;   // Seeded baseline reader interest count
  featuredQuote?: string;     // Memorable pull quote or opening line
  primaryReleaseDate: string; // Earliest format release date ('YYYY-MM-DD')
}
```

---

## 2. Format-Specific Release Dates

In publishing, **paperback and audio editions often release on different dates than hardcovers**. 
In BookBloom, every format in the `formats` array carries its own `releaseDate`.

### Example Entry:
```typescript
{
  id: 'book-061',
  title: 'The Alchemist of Prague',
  author: 'Genevieve Cogman',
  publisher: 'Tor Publishing Group',
  imprint: 'Tor Books',
  coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
  genreTags: ['Fantasy', 'Historical Fantasy', 'Mystery & Thriller'],
  series: {
    name: 'The Alchemical Syndicate',
    number: 1,
  },
  description: 'In 1888 Prague, an alchemical sleuth investigates the murder of a clockwork artisan who discovered the formula for liquid gold.',
  isbn: '9781250867018',
  formats: [
    { type: 'hardcover', releaseDate: '2026-09-15', price: '$29.99', pageCount: 384 },
    { type: 'ebook', releaseDate: '2026-09-15', price: '$14.99' },
    { type: 'audiobook', releaseDate: '2026-09-15', price: '$26.50', narrator: 'Moira Quirk', duration: '12 hrs 10 mins' },
    { type: 'paperback', releaseDate: '2027-04-20', price: '$18.99', pageCount: 400 },
  ],
  anticipatedCount: 1540,
  featuredQuote: '“To turn lead into gold is a petty craft; to turn silence into truth is the only true alchemy.”',
  primaryReleaseDate: '2026-09-15',
}
```

---

## 3. Thin Data-Access Layer Architecture

UI components **NEVER** import `BOOKS_DATASET` directly. Instead, they call `src/services/bookService.ts`:

- `getBooks(filters)`
- `getBooksReleasingOnDate(dateStr, genre, publisher)`
- `getBooksForMonth(year, monthIndex, genre, publisher)`
- `getWeeklyDigests(year, monthIndex, genre, publisher)`
- `getBookByIsbn(isbn)`
- `getThisDayInHistory(month, day)`

This architecture enables seamless swapping with a remote GraphQL / REST backend or PostgreSQL / Firestore service in production without refactoring UI views.
