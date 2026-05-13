import { ExternalLink, MapPin } from 'lucide-react';
import DealScoreBadge from './DealScoreBadge.jsx';
import RelistBadge from './RelistBadge.jsx';
import { fallbackListingImageUrl, listingImageUrl } from '../utils/listingImages.js';
import { listingAdUrl } from '../utils/listingLinks.js';

const platformLabel = { facebook: 'FB', craigslist: 'CL' };

export default function ListingCard({ listing, onSelect, index, view = 'grid' }) {
  const strong = listing.deal_score >= 70;
  const postedDate = new Date(listing.scraped_at || listing.posted_at);
  const isList = view === 'list';
  return (
    <article
      onClick={() => onSelect(listing)}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onSelect(listing);
      }}
      className={`card animate-slide-fade cursor-pointer overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-radar-green/25 ${strong ? 'score-glow' : ''} ${isList ? 'grid gap-0 sm:grid-cols-[168px_1fr]' : ''}`}
      style={{ animationDelay: `${Math.min(index * 28, 240)}ms` }}
    >
      <div className={`${isList ? 'aspect-[4/3] sm:aspect-auto' : 'aspect-[16/10]'} overflow-hidden bg-zinc-900`}>
        <img
          src={listingImageUrl(listing)}
          alt=""
          className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]"
          onError={(event) => {
            const fallback = fallbackListingImageUrl(listing);
            if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
          }}
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-primary">{listing.title}</h3>
            <div className="mt-1 flex items-center gap-1 text-xs text-secondary"><MapPin size={13} />{listing.location || 'Unknown'}</div>
          </div>
          <DealScoreBadge score={listing.deal_score} />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight text-primary">${Number(listing.price).toLocaleString()}</div>
          <span className="rounded-md border px-2 py-1 text-xs font-semibold surface-soft text-secondary">{platformLabel[listing.platform] || listing.platform}</span>
        </div>
        <RelistBadge listing={listing} />
        <div className="flex items-center justify-between border-t pt-3 text-xs text-tertiary" style={{ borderColor: 'var(--line)' }}>
          <span>{Number.isNaN(postedDate.getTime()) ? 'Recently seen' : postedDate.toLocaleString()}</span>
          <a onClick={(event) => event.stopPropagation()} href={listingAdUrl(listing)} target="_blank" rel="noreferrer" className="link-action">
            View ad <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </article>
  );
}
