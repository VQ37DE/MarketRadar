import { ArrowLeft, Plus } from 'lucide-react';

export default function Watchlists() {
  return (
    <main className="min-h-screen bg-radar-bg p-6 text-zinc-100">
      <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"><ArrowLeft size={16} />Dashboard</a>
      <section className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-white">Watchlists</h1><p className="mt-1 text-sm text-zinc-500">Create keyword searches with platform, radius, price, condition, and alert controls.</p></div>
          <button className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-zinc-950"><Plus size={16} />Add</button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {['Gaming Monitors', 'Gravel Bikes', 'Vintage Cameras', 'Office Finds'].map((name) => (
            <div key={name} className="rounded-lg bg-radar-panel p-4 ring-1 ring-zinc-800">
              <div className="text-lg font-bold text-white">{name}</div>
              <div className="mt-2 text-sm text-zinc-500">Both platforms, 35 mile radius, score alerts over 70.</div>
              <div className="mt-4 flex items-center justify-between text-xs text-zinc-500"><span>Enabled</span><span>Last scrape 2m ago</span></div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
