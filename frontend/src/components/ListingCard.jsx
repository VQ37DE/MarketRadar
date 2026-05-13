import { ExternalLink, MapPin } from 'lucide-react';
import DealScoreBadge from './DealScoreBadge.jsx';
import RelistBadge from './RelistBadge.jsx';

const platformLabel = { facebook: 'FB', craigslist: 'CL' };

export default function ListingCard({ listing, onSelect, index }) {
  const strong = listing.deal_score >= 70;
  return (
    <article onClick={() => onSelect(listing)} className={`animate-slide-fade cursor-pointer overflow-hidden rounded-lg bg-radar-panel ring-1 ring-radar-line transition duration-200 hover:-translate-y-0.5 hover:ring-zinc-500 ${strong ? 'score-glow' : ''}`} style={{ animationDelay: `${Math.min(index * 28, 240)}ms` }}>
      <div className="aspect-[16/10] overflow-hidden bg-zinc-900"><img src={listing.images?.[0]} alt="" className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]" /></div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-white">{listing.title}</h3>
            <div className="mt-1 flex items-center gap-1 text-xs text-zinc-400"><MapPin size={13} />{listing.location || 'Unknown'}</div>
          </div>
          <DealScoreBadge score={listing.deal_score} />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight text-white">${Number(listing.price).toLocaleString()}</div>
          <span className="rounded-md bg-zinc-900 px-2 py-1 text-xs font-semibold text-zinc-300 ring-1 ring-zinc-800">{platformLabel[listing.platform] || listing.platform}</span>
        </div>
        <RelistBadge listing={listing} />
        <div className="flex items-center justify-between border-t border-zinc-800 pt-3 text-xs text-zinc-500">
          <span>{new Date(listing.scraped_at || listing.posted_at).toLocaleString()}</span>
          <a onClick={(event) => event.stopPropagation()} href={listing.url} className="inline-flex items-center gap-1 text-zinc-300 hover:text-white">Open <ExternalLink size={12} /></a>
        </div>
      </div>
    </article>
  );
}
