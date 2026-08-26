import React, { useState } from 'react';
import { sound } from '../utils/soundEffects';
import { Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { KawaiiBow, KawaiiStrawberry, KawaiiBunnyAvatar, KawaiiClover, KawaiiClockDeco } from './KawaiiGraphics';

export const KawaiiStickerBar: React.FC = () => {
  const [isMuted, setIsMuted] = useState(sound.isMuted());
  const [stampedCount, setStampedCount] = useState(0);

  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) sound.playSparkle();
  };

  const handleStampSticker = (type: string, emoji: string) => {
    sound.playSparkle();
    setStampedCount((c) => c + 1);

    confetti({
      particleCount: 20,
      spread: 60,
      origin: { y: 0.85 },
      colors: ['#ffb6ce', '#ff85a2', '#fed7aa', '#bbf7d0', '#c084fc'],
    });
  };

  const stickers = [
    { type: 'bow', icon: <KawaiiBow size={18} />, label: 'Ribbon' },
    { type: 'strawberry', icon: <KawaiiStrawberry size={18} />, label: 'Berry' },
    { type: 'bunny', icon: <KawaiiBunnyAvatar size={20} />, label: 'Bunny' },
    { type: 'clover', icon: <KawaiiClover size={18} />, label: 'Clover' },
    { type: 'clock', icon: <KawaiiClockDeco size={18} />, label: 'Clock' },
    { type: 'heart', icon: <span>💖</span>, label: 'Heart' },
    { type: 'cake', icon: <span>🍰</span>, label: 'Cake' },
    { type: 'book', icon: <span>📖</span>, label: 'Book' },
    { type: 'tea', icon: <span>🍵</span>, label: 'Matcha' },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border-2 border-[#ffb6ce] shadow-lg flex items-center gap-3 transition-all hover:scale-[1.02]">
      <div className="flex items-center gap-1 text-xs font-kawaii text-[#d63384] pr-2 border-r border-[#ffe4ef]">
        <Sparkles className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Cute Stickers:</span>
      </div>

      {/* Sticker buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-[280px] sm:max-w-none">
        {stickers.map((s) => (
          <button
            key={s.type}
            onClick={() => handleStampSticker(s.type, s.label)}
            title={`Stamp ${s.label}`}
            className="w-8 h-8 rounded-full bg-[#fff0f5] hover:bg-[#ffe4ee] border border-[#ffccd9] flex items-center justify-center cursor-pointer transition-transform active:scale-90 hover:scale-110 shadow-xs"
          >
            {s.icon}
          </button>
        ))}
      </div>

      {/* Sound Toggle Button */}
      <div className="pl-2 border-l border-[#ffe4ef] flex items-center gap-2">
        <button
          onClick={handleToggleMute}
          title={isMuted ? 'Unmute cute sound effects' : 'Mute sound effects'}
          className={`p-1.5 rounded-full transition-colors cursor-pointer ${
            isMuted
              ? 'bg-neutral-100 text-neutral-400'
              : 'bg-[#f3e8ff] text-[#9333ea] hover:bg-[#e9d5ff]'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
