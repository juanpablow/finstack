"use client"

import { Category } from "@/types/reports"

interface CategoryButtonsProps {
  categories: Category[]
  activeCategory: string
  onCategoryChange: (categoryName: string) => void
}

export function CategoryButtons({ categories, activeCategory, onCategoryChange }: CategoryButtonsProps) {
  return (
    <div className="flex justify-end mt-16 mb-8">
      <div className="flex items-center gap-3">
        {categories.map((category) => {
          const Icon = category.icon
          const isActive = activeCategory === category.name
          return (
            <div key={category.name} className="relative group">
              <button
                onClick={() => onCategoryChange(category.name)}
                className={`w-12 h-12 flex items-center justify-center transition-all cursor-pointer ${
                  isActive ? "rounded-full shadow-lg bg-primary text-white" : "text-black hover:scale-110"
                }`}
              >
                <Icon className="w-6 h-6" strokeWidth={2.5} />
              </button>
              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="text-white px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap bg-primary">
                  {category.name}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
