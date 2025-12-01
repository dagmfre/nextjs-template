'use client';

interface FilterChipsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

export function FilterChips({ 
  categories, 
  activeCategory, 
  onCategoryChange,
  className = ''
}: FilterChipsProps) {
  return (
    <div className={`overflow-x-auto hide-scrollbar ${className}`}>
      <div className="flex gap-2 py-1 px-4">
        {/* All category */}
        <button
          onClick={() => onCategoryChange('all')}
          className={`
            flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium 
            transition-all duration-200 whitespace-nowrap
            ${activeCategory === 'all'
              ? 'bg-gradient-to-r from-gaming-purple to-gaming-pink text-white shadow-lg shadow-gaming-purple/30'
              : 'bg-tg-secondary text-tg-hint hover:text-white border border-white/5 hover:border-white/20'
            }
          `}
        >
          🎮 All Games
        </button>
        
        {/* Category chips */}
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium 
              transition-all duration-200 whitespace-nowrap
              ${activeCategory === category
                ? 'bg-gradient-to-r from-gaming-purple to-gaming-pink text-white shadow-lg shadow-gaming-purple/30'
                : 'bg-tg-secondary text-tg-hint hover:text-white border border-white/5 hover:border-white/20'
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
