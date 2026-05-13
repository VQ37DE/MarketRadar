import { Plus, Power, Trash2 } from 'lucide-react';

export default function Sidebar({ watchlists }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-zinc-800 bg-radar-panel/70 p-4 lg:block">
      <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-bold text-white">Watchlists</h2><button className="icon-button" title="Add watchlist"><Plus size={16} /></button></div>
      <div className="space-y-2">
        {watchlists.map((item) => (
          <div key={item.id} className="rounded-lg bg-zinc-950/55 p-3 ring-1 ring-zinc-800">
            <div className="flex items-start justify-between gap-2">
              <div><div className="text-sm font-semibold text-zinc-100">{item.name}</div><div className="mt-1 text-xs text-zinc-500">{(item.keywords || []).join(', ')}</div></div>
              <button className="text-zinc-500 hover:text-zinc-100" title={item.enabled ? 'Disable' : 'Enable'}><Power size={15} /></button>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-zinc-500"><span>{item.result_count ?? 0} results</span><span>{item.last_scraped_at ? new Date(item.last_scraped_at).toLocaleTimeString() : 'Not scraped'}</span></div>
          </div>
        ))}
      </div>
      <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-zinc-800 px-3 py-2 text-sm font-semibold text-zinc-300 hover:bg-zinc-900"><Trash2 size={15} />Manage</button>
    </aside>
  );
}
