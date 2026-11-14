import React from 'react';
import { LanguageMode } from '../../types';
import { Languages, BookOpen } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

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
  const { t } = useLanguage();

  const modes: { id: LanguageMode; label: string; sub: string }[] = [
    { id: 'vi', label: 'Tiếng Việt', sub: 'VI' },
    { id: 'en', label: 'English', sub: 'EN' },
    { id: 'bilingual', label: t('Song ngữ', 'Bilingual'), sub: 'CLIL' }
  ];

  return (
    <div className={`flex items-center space-x-2 max-w-full overflow-x-auto no-scrollbar ${className}`}>
      <div className="hidden sm:flex items-center text-xs font-mono uppercase tracking-wider text-heritage-woodMuted shrink-0">
        <Languages className="w-4 h-4 mr-1 text-heritage-ochre" />
        <span>{t('Chế độ đọc:', 'Mode:')}</span>
      </div>

      <div className="inline-flex p-1 bg-[#0E1813] rounded-xl border border-[#23352C] shadow-inner max-w-full">
        {modes.map((mode) => {
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onChange(mode.id)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-h-[36px] flex items-center space-x-1 sm:space-x-1.5 shrink-0 ${
                isActive
                  ? 'bg-heritage-forest text-heritage-ochre border border-heritage-ochre/40 shadow-sm font-semibold'
                  : 'text-heritage-woodLight hover:text-heritage-wood hover:bg-white/5'
              }`}
            >
              {mode.id === 'bilingual' && <BookOpen className="w-3.5 h-3.5" />}
              <span>{mode.label}</span>
              <span className={`text-[9px] sm:text-[10px] px-1 py-0.5 rounded font-mono ${
                isActive ? 'bg-heritage-ochre/25 text-heritage-ochre' : 'bg-white/5 text-heritage-woodMuted'
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
