import React, { useState, useEffect } from 'react';
import { ActiveInAppNotification, notificationService } from '../services/notificationService';
import { Book } from '../types';
import { Bell, BellRing, Sparkles, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface NotificationToastBannerProps {
  onOpenBookDetails: (book: Book) => void;
  onOpenCountdown: (isbn: string) => void;
}

export const NotificationToastBanner: React.FC<NotificationToastBannerProps> = ({
  onOpenBookDetails,
  onOpenCountdown,
}) => {
  const [activeNotifications, setActiveNotifications] = useState<ActiveInAppNotification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((newNotif) => {
      setActiveNotifications((prev) => [newNotif, ...prev.slice(0, 2)]);

      // Auto dismiss after 9 seconds
      setTimeout(() => {
        setActiveNotifications((prev) => prev.filter((n) => n.id !== newNotif.id));
      }, 9000);
    });

    return () => unsubscribe();
  }, []);

  const dismissNotif = (id: string) => {
    sound.playPop();
    setActiveNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (activeNotifications.length === 0) return null;

  return (
    <aside aria-label="Release Day Notifications" className="fixed top-18 right-4 sm:right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-2 sm:px-0">
      {activeNotifications.map((notif) => (
        <div
          key={notif.id}
          className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl border-2 border-[#ff85a2] shadow-2xl p-4 overflow-hidden transform animate-in slide-in-from-top-4 duration-300 relative"
          style={{
            boxShadow: '0 10px 25px -5px rgba(255, 133, 162, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Top header badge */}
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#ffe4ee]">
            <div className="flex items-center gap-1.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-tr from-[#ff85a2] to-[#ffb6ce] text-white shadow-xs animate-bounce">
                <BellRing className="w-3.5 h-3.5" />
              </span>
              <span className="font-kawaii text-xs font-bold text-[#d63384] tracking-tight">
                {notif.isSimulated ? '🔔 SIMULATED RELEASE DAY NOTIFICATION' : '🌸 TODAY IS RELEASE DAY!'}
              </span>
            </div>
            <button
              onClick={() => dismissNotif(notif.id)}
              className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Book Info Body */}
          <div className="flex items-start gap-3.5">
            {/* Thumbnail */}
            <div
              onClick={() => {
                onOpenBookDetails(notif.book);
                dismissNotif(notif.id);
              }}
              className="w-14 h-20 rounded-lg overflow-hidden bg-pink-100 shrink-0 border border-pink-200 cursor-pointer shadow-xs group"
            >
              <img
                src={notif.book.coverImage}
                alt={notif.book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Text details */}
            <div className="flex-1 min-w-0">
              <h4
                onClick={() => {
                  onOpenBookDetails(notif.book);
                  dismissNotif(notif.id);
                }}
                className="font-serif text-sm sm:text-base font-bold text-[#2a1b18] hover:text-[#d63384] transition-colors line-clamp-1 cursor-pointer"
              >
                {notif.book.title}
              </h4>
              <p className="text-xs text-neutral-600 font-cute mt-0.5">by {notif.book.author}</p>
              
              <div className="mt-1.5 flex flex-wrap items-center gap-1">
                {notif.releasingFormats.map((fmt) => (
                  <span
                    key={fmt}
                    className="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-[#fff0f5] text-[#d63384] border border-[#ffccd9] font-semibold"
                  >
                    ✨ {fmt}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={() => {
                    onOpenBookDetails(notif.book);
                    dismissNotif(notif.id);
                  }}
                  className="px-3 py-1 bg-[#ff6b8b] hover:bg-[#e85d7f] text-white text-xs font-kawaii font-semibold rounded-lg shadow-xs transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {
                    onOpenCountdown(notif.book.isbn);
                    dismissNotif(notif.id);
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-pink-50 text-[#d63384] border border-[#ffccd9] text-xs font-cute font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Countdown
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </aside>
  );
};
