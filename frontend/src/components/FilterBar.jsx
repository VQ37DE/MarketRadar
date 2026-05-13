import { SlidersHorizontal } from 'lucide-react';

export default function FilterBar({ categories = [], filters, setFilters }) {
  const controls = (
    <>
      <select aria-label="Category filter" value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })} className="control">
        <option value="all">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
      <select aria-label="Platform filter" value={filters.platform} onChange={(event) => setFilters({ ...filters, platform: event.target.value })} className="control">
        <option value="both">Both platforms</option>
        <option value="facebook">Facebook</option>
        <option value="craigslist">Craigslist</option>
      </select>
      <label className="flex min-h-10 items-center gap-2 rounded-md border px-3 text-xs text-secondary" style={{ borderColor: 'var(--line)', background: 'var(--control)' }}>
        Score
        <input aria-label="Minimum deal score" type="range" min="0" max="100" value={filters.minScore} onChange={(event) => setFilters({ ...filters, minScore: Number(event.target.value) })} />
        <span className="w-8 text-right font-semibold text-primary">{filters.minScore}</span>
      </label>
      <input aria-label="Minimum price" className="control w-full sm:w-28" type="number" placeholder="Min $" value={filters.minPrice} onChange={(event) => setFilters({ ...filters, minPrice: event.target.value })} />
      <input aria-label="Maximum price" className="control w-full sm:w-28" type="number" placeholder="Max $" value={filters.maxPrice} onChange={(event) => setFilters({ ...filters, maxPrice: event.target.value })} />
      <select aria-label="Condition filter" value={filters.condition} onChange={(event) => setFilters({ ...filters, condition: event.target.value })} className="control">
        <option value="">Any condition</option>
        <option value="new">New</option>
        <option value="like_new">Like New</option>
        <option value="good">Good</option>
        <option value="fair">Fair</option>
        <option value="poor">Poor</option>
      </select>
      <label className="flex min-h-10 items-center gap-2 rounded-md border px-3 text-xs text-secondary" style={{ borderColor: 'var(--line)', background: 'var(--control)' }}>
        <input type="checkbox" checked={filters.onlyNew} onChange={(event) => setFilters({ ...filters, onlyNew: event.target.checked })} />
        New since last visit
      </label>
    </>
  );

  return (
    <div className="sticky top-[64px] z-20 border-b px-4 py-3 backdrop-blur-xl lg:px-6" style={{ background: 'color-mix(in srgb, var(--app-bg) 92%, transparent)', borderColor: 'var(--line)' }}>
      <details className="md:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between rounded-md border px-3 text-sm font-semibold text-primary" style={{ borderColor: 'var(--line)', background: 'var(--panel)' }}>
          <span className="flex items-center gap-2"><SlidersHorizontal size={16} />Filters</span>
          <span className="text-xs text-secondary">{filters.category === 'all' ? `${filters.minScore}+ score` : categories.find((category) => category.id === filters.category)?.name}</span>
        </summary>
        <div className="mt-3 grid gap-3">{controls}</div>
      </details>
      <div className="hidden flex-wrap items-center gap-3 md:flex">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary"><SlidersHorizontal size={16} />Filters</div>
        {controls}
      </div>
    </div>
  );
}
