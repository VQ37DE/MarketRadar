import { SlidersHorizontal } from 'lucide-react';

export default function FilterBar({ filters, setFilters }) {
  return (
    <div className="sticky top-[65px] z-20 flex flex-wrap items-center gap-3 border-b border-zinc-800 bg-radar-bg/90 px-4 py-3 backdrop-blur-xl lg:px-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200"><SlidersHorizontal size={16} />Filters</div>
      <select value={filters.platform} onChange={(event) => setFilters({ ...filters, platform: event.target.value })} className="control"><option value="both">Both platforms</option><option value="facebook">Facebook</option><option value="craigslist">Craigslist</option></select>
      <label className="flex items-center gap-2 text-xs text-zinc-400">Score<input type="range" min="0" max="100" value={filters.minScore} onChange={(event) => setFilters({ ...filters, minScore: Number(event.target.value) })} /><span className="w-8 text-zinc-200">{filters.minScore}</span></label>
      <input className="control w-28" type="number" placeholder="Min $" value={filters.minPrice} onChange={(event) => setFilters({ ...filters, minPrice: event.target.value })} />
      <input className="control w-28" type="number" placeholder="Max $" value={filters.maxPrice} onChange={(event) => setFilters({ ...filters, maxPrice: event.target.value })} />
      <select value={filters.condition} onChange={(event) => setFilters({ ...filters, condition: event.target.value })} className="control"><option value="">Any condition</option><option value="new">New</option><option value="like_new">Like New</option><option value="good">Good</option><option value="fair">Fair</option><option value="poor">Poor</option></select>
      <label className="ml-auto flex items-center gap-2 text-xs text-zinc-300"><input type="checkbox" checked={filters.onlyNew} onChange={(event) => setFilters({ ...filters, onlyNew: event.target.checked })} />Only new since last visit</label>
    </div>
  );
}
