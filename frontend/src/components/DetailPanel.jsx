import { ExternalLink, X } from 'lucide-react';
import DealScoreBadge from './DealScoreBadge.jsx';
import RelistBadge from './RelistBadge.jsx';

export default function DetailPanel({ listing, onClose }) {
  if (!listing) return null;
  return (
    <aside className="fixed inset-y-0 right-0 z-40 w-full max-w-md overflow-y-auto border-l border-zinc-800 bg-radar-panel p-5 shadow-2xl lg:sticky lg:top-[65px] lg:h-[calc(100vh-65px)]">
      <div className="mb-4 flex items-start justify-between">
        <div><div className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Listing detail</div><h2 className="mt-1 text-xl font-bold text-white">{listing.title}</h2></div>
        <button className="icon-button" onClick={onClose} title="Close"><X size={16} /></button>
      </div>
      <img src={listing.images?.[0]} alt="" className="aspect-video w-full rounded-lg object-cover ring-1 ring-zinc-800" />
      <div className="mt-4 flex items-center justify-between"><div className="text-3xl font-bold text-white">${Number(listing.price).toLocaleString()}</div><DealScoreBadge score={listing.deal_score} /></div>
      <div className="mt-4"><RelistBadge listing={listing} /></div>
      <p className="mt-5 text-sm leading-6 text-zinc-300">{listing.description || 'No description captured yet.'}</p>
      <a href={listing.url} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200">Contact Seller <ExternalLink size={16} /></a>
      <div className="mt-6">
        <h3 className="text-sm font-bold text-white">Price History</h3>
        <div className="mt-3 space-y-2">
          {(listing.history?.length ? listing.history : [{ observed_at: listing.scraped_at, price: listing.price, title: listing.title }]).map((entry, index) => (
            <div key={`${entry.observed_at}-${index}`} className="flex items-center justify-between rounded-md bg-zinc-950/60 px-3 py-2 text-sm ring-1 ring-zinc-800"><span className="text-zinc-400">{new Date(entry.observed_at).toLocaleDateString()}</span><span className="font-semibold text-zinc-100">${Number(entry.price).toLocaleString()}</span></div>
          ))}
        </div>
      </div>
    </aside>
  );
}
