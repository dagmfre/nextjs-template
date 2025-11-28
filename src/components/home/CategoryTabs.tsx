'use client';

import { useState } from 'react';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryTabs({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: CategoryTabsProps) {
  return (
    <section className="px-4 pb-4">
      <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
        <button
          onClick={() => onCategoryChange('all')}
          className={`
            flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all
            ${activeCategory === 'all'
              ? 'bg-gradient-to-r from-gaming-purple to-gaming-pink text-white'
              : 'bg-tg-secondary text-tg-hint hover:text-white border border-white/5'
            }
          `}
        >
          All Games
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all
              ${activeCategory === category
                ? 'bg-gradient-to-r from-gaming-purple to-gaming-pink text-white'
                : 'bg-tg-secondary text-tg-hint hover:text-white border border-white/5'
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}
