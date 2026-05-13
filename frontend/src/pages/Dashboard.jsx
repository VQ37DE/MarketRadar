import { useEffect, useMemo, useState } from 'react';
import { LayoutGrid, List, Moon, Radar, Search, Settings, Sun } from 'lucide-react';
import DetailPanel from '../components/DetailPanel.jsx';
import FilterBar from '../components/FilterBar.jsx';
import ListingCard from '../components/ListingCard.jsx';
import Sidebar from '../components/Sidebar.jsx';
import seedListings from '../../../seeds/mock_listings.json';

const API = '/api/v1';

export default function Dashboard({ setRoute, theme, setTheme }) {
  const [listings, setListings] = useState(seedListings);
  const [watchlists, setWatchlists] = useState([]);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('score');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ platform: 'both', minScore: 0, minPrice: '', maxPrice: '', condition: '', onlyNew: false });

  useEffect(() => {
    const load = async () => {
      try {
        const [listingRes, watchlistRes] = await Promise.all([fetch(`${API}/listings`), fetch(`${API}/watchlists`)]);
        if (listingRes.ok) {
          const data = await listingRes.json();
          if (data.length) setListings(data);
        }
        if (watchlistRes.ok) setWatchlists(await watchlistRes.json());
      } catch {
        setWatchlists([{ id: 'gaming-monitors', name: 'Gaming Monitors', enabled: true, keywords: ['monitor', '1440p'], result_count: 8 }, { id: 'gravel-bikes', name: 'Gravel Bikes', enabled: true, keywords: ['gravel bike', 'diverge'], result_count: 4 }]);
      }
    };
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, []);

  const filtered = useMemo(() => {
    const now = Date.now();
    return listings
      .filter((listing) => filters.platform === 'both' || listing.platform === filters.platform)
      .filter((listing) => listing.deal_score >= filters.minScore)
      .filter((listing) => !filters.minPrice || listing.price >= Number(filters.minPrice))
      .filter((listing) => !filters.maxPrice || listing.price <= Number(filters.maxPrice))
      .filter((listing) => !filters.condition || listing.condition === filters.condition)
      .filter((listing) => !query || listing.title.toLowerCase().includes(query.toLowerCase()))
      .filter((listing) => !filters.onlyNew || now - new Date(listing.scraped_at || listing.posted_at).getTime() < 24 * 60 * 60 * 1000)
      .sort((a, b) => {
        if (sort === 'price') return a.price - b.price;
        if (sort === 'newest') return new Date(b.scraped_at || b.posted_at) - new Date(a.scraped_at || a.posted_at);
        return b.deal_score - a.deal_score;
      });
  }, [filters, listings, query, sort]);

  return (
    <main className="app-shell min-h-screen">
      <nav className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 backdrop-blur-xl lg:px-6" style={{ background: 'color-mix(in srgb, var(--app-bg) 92%, transparent)', borderColor: 'var(--line)' }}>
        <button onClick={() => setRoute('/')} className="flex min-h-11 shrink-0 items-center gap-2 rounded-md pr-2 text-lg font-extrabold text-primary focus:outline-none focus:ring-2 focus:ring-radar-green/25" aria-label="MarketRadar home">
          <Radar className="text-radar-green" size={24} />
          <span className="hidden sm:inline">MarketRadar</span>
        </button>
        <div className="mx-auto flex h-11 w-full max-w-xl items-center gap-2 rounded-lg border px-3" style={{ background: 'var(--panel)', borderColor: 'var(--line)' }}>
          <Search size={16} className="text-tertiary" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search listings" className="w-full bg-transparent text-sm text-primary outline-none placeholder:text-zinc-500" />
        </div>
        <button onClick={() => setView(view === 'grid' ? 'list' : 'grid')} className="icon-button" title="Toggle layout">{view === 'grid' ? <List size={17} /> : <LayoutGrid size={17} />}</button>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="icon-button hidden sm:inline-flex" title="Toggle theme">{theme === 'dark' ? <Moon size={17} /> : <Sun size={17} />}</button>
        <button onClick={() => setRoute('/settings')} className="icon-button" title="Settings"><Settings size={17} /></button>
      </nav>
      <FilterBar filters={filters} setFilters={setFilters} />
      <div className="flex">
        <Sidebar watchlists={watchlists} onManage={() => setRoute('/watchlists')} />
        <section className="min-w-0 flex-1 p-4 lg:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-primary">Unified Feed</h1>
              <p className="text-sm text-secondary">{filtered.length} listings ranked by signal quality</p>
            </div>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="control"><option value="score">Deal Score</option><option value="price">Price low to high</option><option value="newest">Newest first</option></select>
          </div>
          <div className={view === 'grid' ? 'grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3' : 'grid grid-cols-1 gap-3'}>
            {filtered.map((listing, index) => <ListingCard key={listing.id} listing={listing} index={index} view={view} onSelect={setSelected} />)}
          </div>
        </section>
        <DetailPanel listing={selected} onClose={() => setSelected(null)} />
      </div>
    </main>
  );
}
