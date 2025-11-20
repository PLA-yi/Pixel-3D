import React from 'react';
import { Season } from '../types';

interface SeasonSelectorProps {
  selectedSeason: Season;
  onSelect: (season: Season) => void;
  disabled: boolean;
}

export const SeasonSelector: React.FC<SeasonSelectorProps> = ({ selectedSeason, onSelect, disabled }) => {
  const seasons = [
    { id: Season.SPRING, label: '春 Spring', icon: '🌸', color: 'text-pink-600 border-pink-200 bg-pink-50 ring-pink-200' },
    { id: Season.SUMMER, label: '夏 Summer', icon: '☀️', color: 'text-orange-600 border-orange-200 bg-orange-50 ring-orange-200' },
    { id: Season.AUTUMN, label: '秋 Autumn', icon: '🍁', color: 'text-amber-600 border-amber-200 bg-amber-50 ring-amber-200' },
    { id: Season.WINTER, label: '冬 Winter', icon: '❄️', color: 'text-cyan-600 border-cyan-200 bg-cyan-50 ring-cyan-200' },
  ];

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-3">选择季节主题</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {seasons.map((season) => {
          const isSelected = selectedSeason === season.id;
          return (
            <button
              key={season.id}
              onClick={() => onSelect(season.id)}
              disabled={disabled}
              className={`
                relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200
                ${isSelected 
                  ? `${season.color} border-current ring-1 ring-offset-1 ring-current shadow-sm` 
                  : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:bg-slate-50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
              `}
            >
              <span className="text-2xl mb-1 filter drop-shadow-sm">{season.icon}</span>
              <span className={`text-xs font-bold ${isSelected ? 'opacity-100' : 'opacity-70'}`}>
                {season.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};