import { Category } from "@/types/reports"

interface CategoryLegendProps {
  categories: Category[]
  categoryColors: Record<string, string>
}

export function CategoryLegend({ categories, categoryColors }: CategoryLegendProps) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
      {categories.map((cat) => (
        <div key={cat.name} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors[cat.name] }} />
          <span className="text-sm text-gray-700">{cat.name}</span>
        </div>
      ))}
    </div>
  )
}
