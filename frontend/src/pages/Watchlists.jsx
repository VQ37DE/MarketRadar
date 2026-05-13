import { ArrowLeft, Plus } from 'lucide-react';

export default function Watchlists({ setRoute }) {
  return (
    <main className="app-shell min-h-screen p-4 sm:p-6">
      <button onClick={() => setRoute('/')} className="ghost-button mb-8"><ArrowLeft size={16} />Dashboard</button>
      <section className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h1 className="text-2xl font-bold text-primary">Watchlists</h1><p className="mt-1 text-sm text-secondary">4 active searches</p></div>
          <button className="primary-button"><Plus size={16} />Add</button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {['Gaming Monitors', 'Gravel Bikes', 'Vintage Cameras', 'Office Finds'].map((name) => (
            <div key={name} className="card p-4">
              <div className="text-lg font-bold text-primary">{name}</div>
              <div className="mt-2 text-sm text-secondary">Both platforms, 35 mile radius, alerts over 70.</div>
              <div className="mt-4 flex items-center justify-between text-xs text-tertiary"><span>Enabled</span><span>Last scrape 2m ago</span></div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
