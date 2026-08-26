import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface BookCoverImageProps {
  src: string;
  title: string;
  author: string;
  className?: string;
  aspectRatio?: string;
}

export const BookCoverImage: React.FC<BookCoverImageProps> = ({
  src,
  title,
  author,
  className = 'w-full h-full object-cover',
  aspectRatio = 'aspect-[2/3]',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Palette generator based on title hash for authentic jacket fallback
  const getFallbackTheme = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const themes = [
      { bg: 'bg-[#2b3542]', accent: 'border-[#d4af37]', text: 'text-[#f5f1e8]', spine: 'bg-[#1e2630]' },
      { bg: 'bg-[#3b2d28]', accent: 'border-[#e2a87c]', text: 'text-[#faebd7]', spine: 'bg-[#291e1a]' },
      { bg: 'bg-[#21352d]', accent: 'border-[#8fbc8f]', text: 'text-[#eef5ee]', spine: 'bg-[#15241e]' },
      { bg: 'bg-[#38263e]', accent: 'border-[#d8bfd8]', text: 'text-[#f8f4f9]', spine: 'bg-[#271a2b]' },
      { bg: 'bg-[#403828]', accent: 'border-[#f0e68c]', text: 'text-[#faf8ee]', spine: 'bg-[#2e281c]' },
    ];
    return themes[Math.abs(hash) % themes.length];
  };

  const theme = getFallbackTheme(title);

  return (
    <div
      className={`relative overflow-hidden rounded-md shadow-sm border border-neutral-200/80 group-hover:shadow-md transition-shadow ${aspectRatio}`}
    >
      {!hasError && src ? (
        <>
          {!isLoaded && (
            <div className={`absolute inset-0 ${theme.bg} animate-pulse flex items-center justify-center p-3 text-center`}>
              <BookOpen className="w-6 h-6 text-white/40" />
            </div>
          )}
          <img
            src={src}
            alt={`Cover of ${title} by ${author}`}
            className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />
        </>
      ) : (
        /* Stylized book jacket fallback */
        <div className={`w-full h-full ${theme.bg} ${theme.text} p-4 flex flex-col justify-between border-l-4 ${theme.spine} relative select-none`}>
          <div className={`absolute inset-2 border ${theme.accent} opacity-30 pointer-events-none rounded-xs`} />
          <div className="relative z-10 pt-1">
            <span className="text-[10px] tracking-widest uppercase opacity-70 block font-mono">BookBloom Edition</span>
            <h4 className="font-serif text-sm font-bold leading-tight mt-1 line-clamp-3">{title}</h4>
          </div>
          <div className="relative z-10 pb-1">
            <p className="text-xs font-medium opacity-90 truncate">{author}</p>
            <div className="w-6 h-0.5 bg-current opacity-40 mt-1.5" />
          </div>
        </div>
      )}
    </div>
  );
};
