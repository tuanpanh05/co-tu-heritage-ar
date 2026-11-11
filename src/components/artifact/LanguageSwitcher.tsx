import React from 'react';
import { LanguageMode } from '../../types';
import { Languages, BookOpen } from 'lucide-react';

interface LanguageSwitcherProps {
  currentMode: LanguageMode;
  onChange: (mode: LanguageMode) => void;
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentMode,
  onChange,
  className = ''
}) => {
  const modes: { id: LanguageMode; label: string; sub: string }[] = [
    { id: 'vi', label: 'Tiếng Việt', sub: 'VI' },
    { id: 'en', label: 'English', sub: 'EN' },
    { id: 'bilingual', label: 'Song ngữ', sub: 'CLIL' }
  ];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="hidden sm:flex items-center text-xs font-semibold text-heritage-woodMuted uppercase tracking-wider">
        <Languages className="w-4 h-4 mr-1 text-heritage-clay" />
        <span>Chế độ đọc:</span>
      </div>

      <div className="inline-flex p-1 bg-heritage-cream rounded-xl border border-heritage-sand shadow-inner">
        {modes.map((mode) => {
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onChange(mode.id)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all min-h-[38px] flex items-center space-x-1.5 ${
                isActive
                  ? 'bg-heritage-clay text-white shadow-sm'
                  : 'text-heritage-wood hover:text-heritage-woodLight hover:bg-heritage-ivory/50'
              }`}
            >
              {mode.id === 'bilingual' && <BookOpen className="w-3.5 h-3.5" />}
              <span>{mode.label}</span>
              <span className={`text-[10px] px-1 py-0.2 rounded ${
                isActive ? 'bg-white/20 text-white' : 'bg-heritage-sand/60 text-heritage-woodMuted'
              }`}>
                {mode.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

