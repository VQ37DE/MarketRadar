import { ExternalLink, X } from 'lucide-react';
import DealScoreBadge from './DealScoreBadge.jsx';
import RelistBadge from './RelistBadge.jsx';
import { fallbackListingImageUrl, listingImageUrl } from '../utils/listingImages.js';
import { isGeneratedAdUrl, listingAdUrl } from '../utils/listingLinks.js';

export default function DetailPanel({ listing, onClose }) {
  if (!listing) return null;
  return (
    <>
      <button className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} aria-label="Close listing detail" />
      <aside className="fixed inset-y-0 right-0 z-40 w-full max-w-md overflow-y-auto border-l p-5 shadow-2xl lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px)]" style={{ background: 'var(--panel)', borderColor: 'var(--line)' }} aria-label="Listing detail">
        <div className="mb-4 flex items-start justify-between">
          <div className="min-w-0 pr-3"><div className="text-xs font-semibold uppercase tracking-widest text-tertiary">Listing detail</div><h2 className="mt-1 text-xl font-bold text-primary">{listing.title}</h2></div>
          <button className="icon-button" onClick={onClose} title="Close"><X size={16} /></button>
        </div>
        <img
          src={listingImageUrl(listing)}
          alt={listing.title}
          className="aspect-video w-full rounded-lg object-cover ring-1"
          style={{ '--tw-ring-color': 'var(--line)' }}
          onError={(event) => {
            const fallback = fallbackListingImageUrl(listing);
            if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
          }}
        />
        <div className="mt-4 flex items-center justify-between"><div className="text-3xl font-bold text-primary">${Number(listing.price).toLocaleString()}</div><DealScoreBadge score={listing.deal_score} /></div>
        <div className="mt-4"><RelistBadge listing={listing} /></div>
        <p className="mt-5 text-sm leading-6 text-secondary">{listing.description || 'No description captured yet.'}</p>
        <a href={listingAdUrl(listing)} target="_blank" rel="noreferrer" className="primary-button mt-5 w-full">View Ad / Contact Seller <ExternalLink size={16} /></a>
        <div className="mt-2 truncate text-center text-xs text-tertiary">
          {isGeneratedAdUrl(listing) ? 'Demo item: opens a matching platform search' : 'Opens the original listing ad'}
        </div>
        <div className="mt-6">
          <h3 className="text-sm font-bold text-primary">Price History</h3>
          <div className="mt-3 space-y-2">
            {(listing.history?.length ? listing.history : [{ observed_at: listing.scraped_at, price: listing.price, title: listing.title }]).map((entry, index) => (
              <div key={`${entry.observed_at}-${index}`} className="flex min-h-10 items-center justify-between rounded-md border px-3 py-2 text-sm surface-soft"><span className="text-secondary">{new Date(entry.observed_at).toLocaleDateString()}</span><span className="font-semibold text-primary">${Number(entry.price).toLocaleString()}</span></div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
