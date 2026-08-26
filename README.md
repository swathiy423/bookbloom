<div align="center">

# 🌸 BookBloom

**A cozy, reader-facing book release calendar & literary discovery app**

</div>

BookBloom helps readers keep track of upcoming and newly released books. Browse today's releases, explore a full calendar, follow your favorite authors, build a watchlist, and get countdowns and notifications for the titles you're anticipating most, all wrapped in a soft, kawaii-inspired UI.

View the app in AI Studio: https://ai.studio/apps/be9db0ae-f0e2-43f4-95a9-f83c40845dfe

---

## ✨ Features

- **Today View**: see what's releasing today, formatted for a given anchor date
- **Calendar View**: browse releases by month/day, filterable by genre, publisher, and format
- **Coming This Month / Weekly Digests**: grouped upcoming releases, week by week
- **Watchlist**: save books you're anticipating and track them in one place
- **Followed Authors**: follow authors and filter the catalog to just their upcoming work
- **Countdown View**: a dedicated countdown page for a single book (shareable via URL hash)
- **In-app & browser notifications**: get notified (with a toast + confetti 🎉) when a followed/watchlisted book's release day arrives
- **"This Day in History"**: a featured publishing-history entry for the current date
- **Search & filters**: filter by genre, publisher, format, or followed-authors-only, with multiple sort orders
- **Sound effects & kawaii sticker UI** for a playful, cozy feel
- **Hash-based routing**: `#/today`, `#/calendar`, `#/digest`, `#/watchlist`, `#/countdown/:isbn`, plus `?genre=`, `?publisher=`, `?format=` query params for deep linking

## 🧱 Tech Stack

- **React 19** + **TypeScript**
- **Vite 6** for dev/build tooling
- **Tailwind CSS 4** (via `@tailwindcss/vite`)
- **lucide-react** for icons
- **motion** for animation
- **canvas-confetti** for celebratory effects
- **@google/genai**: Gemini API client (server-side capability)
- **Express**: minimal server support

## 📁 Project Structure

```
src/
├── App.tsx                     # Root component, routing, and top-level state
├── main.tsx                    # App entry point
├── index.css                   # Global styles / Tailwind entry
├── types.ts                    # Shared TypeScript types (Book, FilterState, ActiveView, ...)
├── components/
│   ├── Navbar.tsx
│   ├── TodayView.tsx
│   ├── CalendarView.tsx
│   ├── ComingThisMonthView.tsx
│   ├── WatchlistView.tsx
│   ├── CountdownView.tsx
│   ├── BookCard.tsx
│   ├── BookCoverImage.tsx
│   ├── BookDetailModal.tsx
│   ├── FilterBar.tsx
│   ├── FollowedAuthorsModal.tsx
│   ├── NotificationToastBanner.tsx
│   ├── PublishingHistoryWidget.tsx
│   ├── KawaiiGraphics.tsx
│   └── KawaiiStickerBar.tsx
├── hooks/
│   └── useUserPreferences.ts   # Followed authors, watchlist, anticipated, notification prefs (localStorage)
├── services/
│   ├── bookService.ts          # Data-access layer: getBooks, getBooksForMonth, getWeeklyDigests, etc.
│   └── notificationService.ts  # Browser + in-app notification handling
├── utils/
│   └── soundEffects.ts
└── data/
    └── booksData.ts            # Seed catalog (60 books)
```

See [`ADD_BOOKS.md`](./ADD_BOOKS.md) for the full `Book` data schema and instructions on adding new titles to the catalog.

## 🚀 Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and set your Gemini API key:
   ```bash
   GEMINI_API_KEY="your-gemini-api-key"
   ```
   (In AI Studio, this is injected automatically via the Secrets panel.)
3. Start the dev server:
   ```bash
   npm run dev
   ```
   The app runs at `http://localhost:3000`.

## 📜 Available Scripts

| Script            | Description                          |
|-------------------|---------------------------------------|
| `npm run dev`     | Start the Vite dev server (port 3000) |
| `npm run build`   | Build for production                  |
| `npm run preview` | Preview the production build locally  |
| `npm run lint`    | Type-check with `tsc --noEmit`        |
| `npm run clean`   | Remove `dist/` and `server.js`        |

## 🗂 Data Architecture

UI components never read the seed dataset directly. They go through `src/services/bookService.ts`, a thin data-access layer (`getBooks`, `getBooksReleasingOnDate`, `getBooksForMonth`, `getWeeklyDigests`, `getBookByIsbn`, `getThisDayInHistory`, ...). This keeps the door open for swapping the static seed data for a real backend (REST/GraphQL, Postgres, Firestore) without touching the views.

User state (followed authors, watchlist, anticipated books, and notification preferences) is persisted client-side via `localStorage` in `useUserPreferences.ts`.

## 🤝 Contributing

To add or edit book entries in the catalog, see [`ADD_BOOKS.md`](./ADD_BOOKS.md) for the schema and an example entry.
