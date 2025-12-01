'use client';

import { useState, useCallback } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterClick?: () => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ 
  onSearch, 
  onFilterClick,
  placeholder = 'Search games...',
  className = '' 
}: SearchBarProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch(newValue);
  }, [onSearch]);
  
  const handleClear = useCallback(() => {
    setValue('');
    onSearch('');
  }, [onSearch]);
  
  return (
    <div className={`relative ${className}`}>
      <div 
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl
          bg-tg-secondary border transition-all duration-200
          ${isFocused 
            ? 'border-gaming-purple shadow-lg shadow-gaming-purple/20' 
            : 'border-white/5'
          }
        `}
      >
        {/* Search Icon */}
        <span className="text-tg-hint text-lg">🔍</span>
        
        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white text-sm placeholder:text-tg-hint outline-none"
        />
        
        {/* Clear button */}
        {value && (
          <button
            onClick={handleClear}
            className="text-tg-hint hover:text-white transition-colors text-sm"
          >
            ✕
          </button>
        )}
        
        {/* Filter button */}
        {onFilterClick && (
          <button
            onClick={onFilterClick}
            className="text-tg-hint hover:text-gaming-purple transition-colors text-lg pl-2 border-l border-white/10"
          >
            ⚙️
          </button>
        )}
      </div>
    </div>
  );
}
