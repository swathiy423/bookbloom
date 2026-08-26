import React from 'react';

// Cute Pink Ribbon Bow SVG
export const KawaiiBow: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block select-none ${className}`}
  >
    {/* Ribbon Left Loop */}
    <path
      d="M24 18 C18 6, 4 8, 6 20 C8 28, 20 22, 24 18 Z"
      fill="#ff9eb5"
      stroke="#e85d7f"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M18 16 C12 12, 8 14, 10 20"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Ribbon Right Loop */}
    <path
      d="M24 18 C30 6, 44 8, 42 20 C40 28, 28 22, 24 18 Z"
      fill="#ff9eb5"
      stroke="#e85d7f"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M30 16 C36 12, 40 14, 38 20"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Ribbon Tails */}
    <path
      d="M22 20 L12 34 L18 30 L22 22"
      fill="#ff7597"
      stroke="#e85d7f"
      strokeWidth="1.5"
    />
    <path
      d="M26 20 L36 34 L30 30 L26 22"
      fill="#ff7597"
      stroke="#e85d7f"
      strokeWidth="1.5"
    />
    {/* Center Knot */}
    <ellipse
      cx="24"
      cy="18"
      rx="5"
      ry="4.5"
      fill="#ff5c85"
      stroke="#e85d7f"
      strokeWidth="2"
    />
    <circle cx="23" cy="16.5" r="1.5" fill="#ffffff" />
  </svg>
);

// Cute Strawberry Icon SVG
export const KawaiiStrawberry: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block select-none ${className}`}
  >
    {/* Leaves */}
    <path
      d="M20 12 C16 4, 6 6, 8 14 C12 12, 16 13, 20 12 Z"
      fill="#78c97e"
      stroke="#4ea355"
      strokeWidth="1.5"
    />
    <path
      d="M20 12 C24 4, 34 6, 32 14 C28 12, 24 13, 20 12 Z"
      fill="#78c97e"
      stroke="#4ea355"
      strokeWidth="1.5"
    />
    <path
      d="M20 12 C20 4, 22 2, 21 0"
      stroke="#4ea355"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Strawberry Body */}
    <path
      d="M20 11 C29 11, 36 18, 33 29 C30 38, 23 42, 20 43 C17 42, 10 38, 7 29 C4 18, 11 11, 20 11 Z"
      fill="#ff6b8b"
      stroke="#e0486b"
      strokeWidth="2"
    />
    {/* Highlight */}
    <path
      d="M13 18 C11 23, 10 28, 11 30"
      stroke="#ffa3b8"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Seeds */}
    <circle cx="16" cy="20" r="1.2" fill="#fff" />
    <circle cx="24" cy="20" r="1.2" fill="#fff" />
    <circle cx="20" cy="26" r="1.2" fill="#fff" />
    <circle cx="15" cy="30" r="1.2" fill="#fff" />
    <circle cx="25" cy="30" r="1.2" fill="#fff" />
    <circle cx="20" cy="36" r="1.2" fill="#fff" />
  </svg>
);

// Cute Bunny Mascot / My Melody style character avatar
export const KawaiiBunnyAvatar: React.FC<{ className?: string; size?: number; expression?: 'happy' | 'sleepy' | 'wink' }> = ({
  className = '',
  size = 48,
  expression = 'happy',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block select-none ${className}`}
  >
    {/* Left Ear (Pink Hood) */}
    <path
      d="M22 26 C16 10, 8 2, 14 0 C20 -2, 28 14, 28 26 Z"
      fill="#ff9eb5"
      stroke="#e85d7f"
      strokeWidth="2"
    />
    {/* Right Ear (Pink Hood) */}
    <path
      d="M42 26 C48 10, 56 2, 50 0 C44 -2, 36 14, 36 26 Z"
      fill="#ff9eb5"
      stroke="#e85d7f"
      strokeWidth="2"
    />
    {/* Pink Hood Head */}
    <circle cx="32" cy="36" r="24" fill="#ff9eb5" stroke="#e85d7f" strokeWidth="2" />
    {/* White Face Cutout */}
    <ellipse cx="32" cy="40" rx="18" ry="15" fill="#ffffff" />
    {/* Eyes */}
    {expression === 'happy' ? (
      <>
        <ellipse cx="26" cy="38" rx="2.5" ry="3.5" fill="#4a3832" />
        <circle cx="25" cy="36.5" r="1" fill="#ffffff" />
        <ellipse cx="38" cy="38" rx="2.5" ry="3.5" fill="#4a3832" />
        <circle cx="37" cy="36.5" r="1" fill="#ffffff" />
      </>
    ) : expression === 'wink' ? (
      <>
        <path d="M23 38 Q26 35 29 38" stroke="#4a3832" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="38" cy="38" rx="2.5" ry="3.5" fill="#4a3832" />
        <circle cx="37" cy="36.5" r="1" fill="#ffffff" />
      </>
    ) : (
      <>
        <path d="M23 39 Q26 42 29 39" stroke="#4a3832" strokeWidth="2" strokeLinecap="round" />
        <path d="M35 39 Q38 42 41 39" stroke="#4a3832" strokeWidth="2" strokeLinecap="round" />
      </>
    )}
    {/* Cute Yellow/Pink Oval Nose */}
    <ellipse cx="32" cy="42" rx="2" ry="1.4" fill="#ffcc00" stroke="#e6b800" strokeWidth="0.8" />
    {/* Rosy Cheeks */}
    <ellipse cx="22" cy="43" rx="3.5" ry="2" fill="#ffb3c6" />
    <ellipse cx="42" cy="43" rx="3.5" ry="2" fill="#ffb3c6" />
    {/* Blue Ribbon Bow on Ear */}
    <g transform="translate(14, 20) scale(0.45)">
      <path d="M12 9 C9 3, 2 4, 3 10 C4 14, 10 11, 12 9 Z" fill="#90caf9" stroke="#42a5f5" strokeWidth="1.5" />
      <path d="M12 9 C15 3, 22 4, 21 10 C20 14, 14 11, 12 9 Z" fill="#90caf9" stroke="#42a5f5" strokeWidth="1.5" />
      <circle cx="12" cy="9" r="2.5" fill="#64b5f6" />
    </g>
  </svg>
);

// Cute Pastel Alarm Clock Deco (Image 2 style)
export const KawaiiClockDeco: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 36 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block select-none ${className}`}
  >
    {/* Cat ears / bells on top */}
    <path d="M14 16 L10 6 L20 11 Z" fill="#ffb8d2" stroke="#e85d7f" strokeWidth="1.5" />
    <path d="M34 16 L38 6 L28 11 Z" fill="#ffb8d2" stroke="#e85d7f" strokeWidth="1.5" />
    {/* Clock body */}
    <circle cx="24" cy="26" r="18" fill="#fff5f8" stroke="#e85d7f" strokeWidth="2" />
    {/* Clock face inner */}
    <circle cx="24" cy="26" r="14" fill="#ffffff" stroke="#ffd6e6" strokeWidth="1" />
    {/* Clock hands */}
    <line x1="24" y1="26" x2="24" y2="18" stroke="#7e57c2" strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="26" x2="30" y2="28" stroke="#7e57c2" strokeWidth="2" strokeLinecap="round" />
    <circle cx="24" cy="26" r="1.5" fill="#7e57c2" />
    {/* Little flowers & dots */}
    <circle cx="24" cy="14" r="1" fill="#ff85a2" />
    <circle cx="34" cy="26" r="1" fill="#ff85a2" />
    <circle cx="24" cy="36" r="1" fill="#ff85a2" />
    <circle cx="14" cy="26" r="1" fill="#ff85a2" />
    {/* Legs */}
    <line x1="14" y1="42" x2="10" y2="46" stroke="#e85d7f" strokeWidth="2" strokeLinecap="round" />
    <line x1="34" y1="42" x2="38" y2="46" stroke="#e85d7f" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Cute Clover Sticker 🍀
export const KawaiiClover: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block select-none ${className}`}
  >
    {/* 4 Clover leaves */}
    <path d="M18 18 C14 10, 8 10, 10 16 C12 20, 16 18, 18 18 Z" fill="#b9f6ca" stroke="#69f0ae" strokeWidth="1.5" />
    <path d="M18 18 C26 14, 26 8, 20 10 C16 12, 18 16, 18 18 Z" fill="#a7f3d0" stroke="#6ee7b7" strokeWidth="1.5" />
    <path d="M18 18 C22 26, 28 26, 26 20 C24 16, 20 18, 18 18 Z" fill="#b9f6ca" stroke="#69f0ae" strokeWidth="1.5" />
    <path d="M18 18 C10 22, 10 28, 16 26 C20 24, 18 20, 18 18 Z" fill="#a7f3d0" stroke="#6ee7b7" strokeWidth="1.5" />
    {/* Stem */}
    <path d="M18 18 Q20 30 26 34" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Cute Reading Mascot in Heart Badge (Image 2 style)
export const KawaiiReadingMascotBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative inline-flex items-center justify-center ${className}`}>
    {/* Heart Container */}
    <div className="w-20 h-20 rounded-full bg-white border-2 border-[#ffb6ce] shadow-sm flex items-center justify-center p-2 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#fff5f8] opacity-70" />
      {/* Cute Character with Book */}
      <div className="relative z-10 flex flex-col items-center">
        <KawaiiBunnyAvatar size={40} />
        <div className="flex items-center gap-0.5 mt-[-4px] bg-[#ff85a2] text-white text-[9px] font-kawaii px-1.5 py-0.2 rounded-full shadow-xs">
          <span>📖</span>
          <span>Reading!</span>
        </div>
      </div>
    </div>
  </div>
);

// Pastel Scalloped Top Trim (Image 1 style)
export const ScallopedLaceHeader: React.FC<{
  title: string;
  subtitle?: string;
  onClose?: () => void;
  rightAction?: React.ReactNode;
  theme?: 'pink' | 'blue' | 'purple';
}> = ({ title, subtitle, onClose, rightAction, theme = 'pink' }) => {
  const bgClasses = {
    pink: 'bg-[#ffeef4] text-[#a84d6b] border-[#ffd6e6]',
    blue: 'bg-[#e8f4fc] text-[#4878a6] border-[#cbe4f7]',
    purple: 'bg-[#f4eefc] text-[#70559e] border-[#e4d7f5]',
  }[theme];

  return (
    <div className={`relative w-full ${bgClasses} px-4 py-3 border-b`}>
      {/* Scallop lace bumps */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <KawaiiBow size={20} />
          <h2 className="font-kawaii text-lg sm:text-xl font-bold tracking-tight">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {rightAction}
          {onClose && (
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/70 hover:bg-white text-neutral-500 hover:text-neutral-800 flex items-center justify-center text-sm font-bold shadow-xs transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      {subtitle && <p className="text-xs opacity-80 mt-0.5 font-cute">{subtitle}</p>}
    </div>
  );
};
