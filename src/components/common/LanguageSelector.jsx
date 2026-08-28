// Language Selector Component (UZ | RU | EN)

import React from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Globe } from 'lucide-react';

export function LanguageSelector({ variant = 'header' }) {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'uz', label: 'UZ', fullName: 'O\'zbek' },
    { code: 'ru', label: 'RU', fullName: 'Русский' },
    { code: 'en', label: 'EN', fullName: 'English' }
  ];

  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              language === lang.code
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-inner">
      <div className="pl-2 pr-1 text-slate-400 flex items-center gap-1">
        <Globe className="w-3.5 h-3.5 text-sky-400" />
      </div>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          title={lang.fullName}
          className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all duration-200 ${
            language === lang.code
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
