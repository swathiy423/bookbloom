import React, { useState } from 'react';
import { ActiveView } from '../types';
import {
  BookOpen,
  Calendar,
  Layers,
  Star,
  Search,
  Users,
  Clock,
  Sparkles,
  Menu,
  X,
  Heart,
} from 'lucide-react';
import { KawaiiBunnyAvatar } from './KawaiiGraphics';
import { sound } from '../utils/soundEffects';

interface NavbarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  watchlistCount: number;
  followedAuthorsCount: number;
  notifiedCount?: number;
  onOpenFollowedAuthors: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentDateStr: string;
  onChangeDate: (dateStr: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onSelectView,
  watchlistCount,
  followedAuthorsCount,
  notifiedCount = 0,
  onOpenFollowedAuthors,
  searchQuery,
  onSearchChange,
  currentDateStr,
  onChangeDate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navItems: { id: ActiveView; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'today',
      label: 'Releasing Today 🌸',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    {
      id: 'calendar',
      label: 'Catalog Calendar',
      icon: <Calendar className="w-3.5 h-3.5" />,
    },
    {
      id: 'digest',
      label: 'This Month',
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    {
      id: 'watchlist',
      label: 'Wishlist',
      icon: <Heart className="w-3.5 h-3.5" />,
      badge: watchlistCount,
    },
  ];

  const handleNavClick = (view: ActiveView) => {
    sound.playPop();
    onSelectView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#fff5f8]/95 backdrop-blur-md border-b border-[#ffd6e6] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => handleNavClick('today')}
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ff85a2] to-[#ffb6ce] text-white flex items-center justify-center shadow-xs border-2 border-white group-hover:scale-105 transition-transform">
              <KawaiiBunnyAvatar size={30} />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-kawaii text-xl sm:text-2xl font-bold tracking-tight text-[#d63384] block leading-none">
                  BookBloom
                </span>
                <span className="text-xs">🌸</span>
              </div>
              <span className="text-[10px] font-cute tracking-wide text-[#ff7597] hidden sm:block mt-0.5 font-medium">
                Kawaii Release Calendar & Planner
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-kawaii font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#ff6b8b] text-white shadow-xs'
                      : 'text-[#6d5045] hover:text-[#d63384] hover:bg-[#ffeef4]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-kawaii px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white/30 text-white' : 'bg-[#ffd6e6] text-[#d63384]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Search Bar & Right Action Pills */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Search Input */}
            <div className="relative hidden sm:block w-40 md:w-48">
              <Search className="w-3.5 h-3.5 text-[#ff85a2] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white text-[#4a3832] placeholder-[#ffb6ce] rounded-full border border-[#ffd6e6] focus:outline-hidden focus:ring-1 focus:ring-[#ff85a2]"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs"
                >
                  ×
                </button>
              )}
            </div>

            {/* Followed Authors Pill */}
            <button
              onClick={() => {
                sound.playPop();
                onOpenFollowedAuthors();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-kawaii font-medium bg-white hover:bg-[#fff0f5] text-[#d63384] border border-[#ffd6e6] transition-colors cursor-pointer shadow-xs"
              title="Manage followed authors"
            >
              <Heart className="w-3.5 h-3.5 text-[#ff6b8b]" />
              <span className="hidden md:inline">Authors</span>
              <span className="text-[10px] font-kawaii px-1.5 py-0.2 rounded-full bg-[#ffe4ee] text-[#d63384] font-bold">
                {followedAuthorsCount}
              </span>
            </button>

            {/* Release Alerts / Notified Pill */}
            {notifiedCount > 0 && (
              <button
                onClick={() => {
                  sound.playPop();
                  onSelectView('watchlist');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-kawaii font-medium bg-[#fff0f5] hover:bg-[#ffe4ee] text-[#d63384] border border-[#ffb6ce] transition-colors cursor-pointer shadow-xs animate-pulse"
                title="View books with release alerts enabled"
              >
                <span>🔔</span>
                <span className="hidden lg:inline">Alerts</span>
                <span className="text-[10px] font-kawaii px-1.5 py-0.2 rounded-full bg-[#ff6b8b] text-white font-bold">
                  {notifiedCount}
                </span>
              </button>
            )}

            {/* Date Anchor / Simulation Pill */}
            <div className="relative">
              <button
                onClick={() => {
                  sound.playPop();
                  setShowDatePicker(!showDatePicker);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-white hover:bg-[#fff0f5] text-[#6d5045] border border-[#ffd6e6] transition-colors cursor-pointer shadow-xs"
                title="Change anchor date"
              >
                <Calendar className="w-3.5 h-3.5 text-[#ff85a2]" />
                <span className="hidden sm:inline">{currentDateStr}</span>
              </button>

              {showDatePicker && (
                <div className="absolute right-0 mt-2 w-64 p-3 bg-white rounded-2xl shadow-xl border-2 border-[#ffd6e6] z-50">
                  <div className="text-[11px] font-kawaii uppercase tracking-wider text-[#d63384] mb-2">
                    Jump to Calendar Date 🌸
                  </div>
                  <input
                    type="date"
                    value={currentDateStr}
                    onChange={(e) => {
                      if (e.target.value) {
                        onChangeDate(e.target.value);
                        setShowDatePicker(false);
                      }
                    }}
                    className="w-full text-xs font-mono p-2 border border-[#ffd6e6] rounded-xl mb-2"
                  />
                  <div className="flex justify-between items-center text-xs">
                    <button
                      onClick={() => {
                        onChangeDate('2026-08-26');
                        setShowDatePicker(false);
                      }}
                      className="text-[#ff6b8b] font-kawaii font-bold hover:underline"
                    >
                      Reset to Aug 26, 2026
                    </button>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="text-neutral-500 hover:text-neutral-800"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => {
                sound.playPop();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="p-2 xl:hidden rounded-xl text-[#d63384] hover:bg-[#ffeef4]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-3 border-t border-[#ffd6e6] space-y-1 animate-in slide-in-from-top-2">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-kawaii font-semibold transition-all ${
                    isActive
                      ? 'bg-[#ff6b8b] text-white'
                      : 'text-[#6d5045] hover:bg-[#ffeef4]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-xs font-kawaii px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/30 text-white' : 'bg-[#ffd6e6] text-[#d63384]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
