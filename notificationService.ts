import { Book, BookFormatType } from '../types';
import { sound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

export type NotificationStatus = 'default' | 'granted' | 'denied' | 'unsupported';

export interface ActiveInAppNotification {
  id: string;
  book: Book;
  message: string;
  releasingFormats: string[];
  dateStr: string;
  isSimulated?: boolean;
  timestamp: number;
}

type NotificationListener = (notification: ActiveInAppNotification) => void;

class NotificationManager {
  private listeners: Set<NotificationListener> = new Set();
  private lastTriggeredKey = 'bookbloom_last_notified_dates';

  public isSupported(): boolean {
    try {
      return typeof window !== 'undefined' && 'Notification' in window && typeof Notification === 'function';
    } catch {
      return false;
    }
  }

  public getPermissionStatus(): NotificationStatus {
    if (!this.isSupported()) return 'unsupported';
    try {
      if (typeof Notification !== 'undefined' && 'permission' in Notification) {
        return Notification.permission as NotificationStatus;
      }
      return 'unsupported';
    } catch {
      return 'unsupported';
    }
  }

  public async requestPermission(): Promise<NotificationStatus> {
    if (!this.isSupported()) return 'unsupported';
    try {
      if (typeof Notification !== 'undefined' && typeof Notification.requestPermission === 'function') {
        const permission = await Notification.requestPermission();
        return permission as NotificationStatus;
      }
      return this.getPermissionStatus();
    } catch {
      return this.getPermissionStatus();
    }
  }

  public subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(notification: ActiveInAppNotification) {
    this.listeners.forEach((listener) => {
      try {
        listener(notification);
      } catch (err) {
        console.error('Error in notification listener:', err);
      }
    });
  }

  /**
   * Dispatches a release-day notification for a book:
   * 1. Triggers real Web Notification API (if permitted)
   * 2. Plays the kawaii audio chime
   * 3. Fires confetti celebration
   * 4. Emits to in-app toast subscribers
   */
  public triggerReleaseDayNotification(
    book: Book,
    dateStr: string,
    isSimulated: boolean = false
  ) {
    // Formats releasing on this date or all formats
    const releasingFormats = book.formats
      .filter((f) => f.releaseDate === dateStr || isSimulated)
      .map((f) => f.type);

    const formatListText =
      releasingFormats.length > 0
        ? releasingFormats.map((f) => f.charAt(0).toUpperCase() + f.slice(1)).join(', ')
        : 'All Editions';

    const title = `🌸 Release Day Alert: ${book.title}`;
    const bodyText = `🎉 Out today! "${book.title}" by ${book.author} is now available in bookstores (${formatListText}).`;

    // 1. Browser Native HTML5 Notification
    try {
      if (this.isSupported() && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        const notif = new Notification(title, {
          body: bodyText,
          icon: book.coverImage || undefined,
          badge: book.coverImage || undefined,
          tag: `bookbloom-release-${book.id}-${dateStr}`,
          silent: false,
        });

        notif.onclick = () => {
          try {
            window.focus();
            window.location.hash = `#/countdown/${book.isbn}`;
            notif.close();
          } catch {
            // ignore
          }
        };
      }
    } catch (e) {
      console.warn('Native notification skipped or restricted by iframe permissions policy:', e);
    }

    // 2. Play cute chime
    sound.playAlarmChime();

    // 3. Confetti burst
    try {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.3, x: 0.8 },
        colors: ['#ff85a2', '#ffb6ce', '#f4b5d6', '#c084fc', '#fde047'],
      });
    } catch {
      // Ignore
    }

    // 4. In-App Notification Toast
    const inAppNotif: ActiveInAppNotification = {
      id: `${book.id}-${Date.now()}`,
      book,
      message: bodyText,
      releasingFormats: releasingFormats.length > 0 ? releasingFormats : ['Hardcover', 'eBook'],
      dateStr,
      isSimulated,
      timestamp: Date.now(),
    };

    this.notifyListeners(inAppNotif);
    return inAppNotif;
  }

  /**
   * Checks all books against user's notified list and current simulated date.
   * Only triggers if date matches and hasn't already fired in this session for this date.
   */
  public checkDueNotifications(
    books: Book[],
    notifiedBookIds: string[],
    currentDateStr: string
  ) {
    if (!notifiedBookIds || notifiedBookIds.length === 0) return [];

    let notifiedHistory: Record<string, string[]> = {};
    try {
      const saved = localStorage.getItem(this.lastTriggeredKey);
      if (saved) notifiedHistory = JSON.parse(saved);
    } catch {
      notifiedHistory = {};
    }

    const triggeredTodayForDate = notifiedHistory[currentDateStr] || [];
    const triggered: ActiveInAppNotification[] = [];

    books.forEach((book) => {
      if (!notifiedBookIds.includes(book.id)) return;

      // Check if this book has any format releasing on currentDateStr
      const hasReleaseToday = book.formats.some((f) => f.releaseDate === currentDateStr);
      if (hasReleaseToday) {
        // If not already triggered for this specific book on this specific date
        if (!triggeredTodayForDate.includes(book.id)) {
          const notif = this.triggerReleaseDayNotification(book, currentDateStr, false);
          triggered.push(notif);
          triggeredTodayForDate.push(book.id);
        }
      }
    });

    if (triggered.length > 0) {
      notifiedHistory[currentDateStr] = triggeredTodayForDate;
      try {
        localStorage.setItem(this.lastTriggeredKey, JSON.stringify(notifiedHistory));
      } catch {
        // Ignore
      }
    }

    return triggered;
  }
}

export const notificationService = new NotificationManager();
