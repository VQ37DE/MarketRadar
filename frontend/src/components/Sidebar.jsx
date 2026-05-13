import { Plus, Power, SlidersHorizontal } from 'lucide-react';

export default function Sidebar({ categories = [], watchlists, onCategorySelect, onManage }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r p-4 lg:block" style={{ background: 'var(--panel)', borderColor: 'var(--line)' }}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold text-primary">Watchlists</h2>
        <button className="icon-button" title="Add watchlist"><Plus size={16} /></button>
      </div>
      <div className="space-y-2">
        {watchlists.map((item) => (
          <div key={item.id} className="card p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-primary">{item.name}</div>
                <div className="mt-1 truncate text-xs text-tertiary">{(item.keywords || []).join(', ')}</div>
              </div>
              <button className="subtle-icon-button" title={item.enabled ? 'Disable' : 'Enable'}>
                <Power size={15} />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-tertiary"><span>{item.result_count ?? 0} results</span><span>{item.last_scraped_at ? new Date(item.last_scraped_at).toLocaleTimeString() : 'Not scraped'}</span></div>
          </div>
        ))}
      </div>
      <button onClick={onManage} className="ghost-button mt-4 w-full"><SlidersHorizontal size={15} />Manage</button>
      <div className="mt-6 border-t pt-4" style={{ borderColor: 'var(--line)' }}>
        <div className="mb-3 text-xs font-bold uppercase tracking-wider text-tertiary">Search Categories</div>
        <div className="grid gap-1.5">
          {categories.slice(0, 12).map((category) => (
            <button key={category.id} onClick={() => onCategorySelect?.(category)} className="category-row">
              <span className="truncate">{category.name}</span>
              <span className="text-[11px] uppercase text-tertiary">{category.craigslist_category}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
